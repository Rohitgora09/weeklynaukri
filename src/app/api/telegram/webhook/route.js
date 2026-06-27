import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// Telegram Webhook API Endpoint
export async function POST(request) {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) {
      console.error('[Telegram Webhook] TELEGRAM_BOT_TOKEN env variable is missing.');
      return NextResponse.json({ success: false, error: 'Bot token configuration missing' }, { status: 500 });
    }

    const payload = await request.json();
    console.log('[Telegram Webhook] Received payload:', JSON.stringify(payload));

    // Support both channel posts and standard chat messages (groups)
    const msg = payload.channel_post || payload.message;
    if (!msg) {
      return NextResponse.json({ success: true, message: 'No message/post content to parse' });
    }

    // Check if the post contains a document (like a PDF)
    const doc = msg.document;
    if (!doc) {
      return NextResponse.json({ success: true, message: 'Post does not contain a document' });
    }

    const fileId = doc.file_id;
    const fileName = doc.file_name || 'attachment';
    const fileSize = doc.file_size || 0;
    const mimeType = doc.mime_type || 'application/pdf';
    
    // Caption can be the file description or fallback to file name
    const title = (msg.caption || fileName).trim();
    const telegramDate = msg.date ? new Date(msg.date * 1000).toISOString() : new Date().toISOString();

    console.log(`[Telegram Webhook] Processing file: ${fileName} (${mimeType}, size: ${fileSize} bytes)`);

    let storagePath = null;

    try {
      console.log(`[Telegram Webhook] Step 1: Requesting file metadata from Telegram for file_id: ${fileId}...`);
      const fileMetaRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
      
      if (!fileMetaRes.ok) {
        throw new Error(`Telegram getFile metadata API returned status ${fileMetaRes.status}`);
      }
      
      const fileMeta = await fileMetaRes.json();
      console.log(`[Telegram Webhook] Telegram getFile metadata response:`, JSON.stringify(fileMeta));

      if (fileMeta.ok && fileMeta.result?.file_path) {
        const filePath = fileMeta.result.file_path;
        const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

        console.log(`[Telegram Webhook] Step 2: Downloading file content from Telegram: ${downloadUrl}...`);
        const fileResponse = await fetch(downloadUrl);
        
        if (!fileResponse.ok) {
          throw new Error(`Telegram download URL returned status ${fileResponse.status}`);
        }
        
        const fileBuffer = await fileResponse.arrayBuffer();
        console.log(`[Telegram Webhook] File downloaded successfully. Size: ${fileBuffer.byteLength} bytes.`);

        // 2. Upload file to Supabase Storage 'materials' bucket
        const uniqueFileName = `${Date.now()}_${fileName.replace(/\s+/g, '_')}`;
        storagePath = `uploads/${uniqueFileName}`;

        console.log(`[Telegram Webhook] Step 3: Uploading file to Supabase Storage bucket 'materials' at path: ${storagePath}...`);
        const { error: uploadError } = await supabase.storage
          .from('materials')
          .upload(storagePath, fileBuffer, {
            contentType: mimeType,
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.warn('[Telegram Webhook] Supabase Storage upload failed. Fallback to telegram URL...', uploadError.message);
          storagePath = null;
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('materials')
            .getPublicUrl(storagePath);
          
          if (publicUrlData?.publicUrl) {
            storagePath = publicUrlData.publicUrl;
            console.log(`[Telegram Webhook] Uploaded successfully. Public URL: ${storagePath}`);
          }
        }
      } else {
        console.warn(`[Telegram Webhook] Telegram did not return file path metadata:`, fileMeta);
      }
    } catch (err) {
      console.error('[Telegram Webhook] File download/upload process error:', err);
    }

    // 3. Save file entry metadata into study_materials table
    const { error: insertError } = await supabase
      .from('study_materials')
      .insert([
        {
          message_id: msg.message_id,
          title,
          file_name: fileName,
          file_type: mimeType,
          file_size: fileSize,
          storage_path: storagePath, // Will be the public Supabase link, or fallback to null/telegram link
          telegram_file_id: fileId,
          telegram_date: telegramDate
        }
      ]);

    if (insertError) {
      console.error('[Telegram Webhook] Failed to insert metadata into Supabase:', insertError.message);
      return NextResponse.json({ success: false, error: 'Database entry failed' }, { status: 500 });
    }

    console.log('[Telegram Webhook] Synced successfully!');
    return NextResponse.json({ success: true, message: 'Telegram post synced successfully' });

  } catch (err) {
    console.error('[Telegram Webhook] Error:', err.message);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

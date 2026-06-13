import { NextResponse } from 'next/server';
import { getStats } from '../../../../lib/analytics';
import { supabase } from '../../../../lib/supabase';
import { verifyToken } from '../../../../lib/auth';

const nodeStartTime = Date.now(); // Track process uptime

export async function GET(request) {
  try {
    // Check Authorization header or x-admin-password header
    const authHeader = request.headers.get('authorization');
    const adminPasswordHeader = request.headers.get('x-admin-password');
    
    let isAuthorized = false;
 
    // Check x-admin-password
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';
    if (adminPasswordHeader && adminPasswordHeader === expectedPassword) {
      isAuthorized = true;
    }

    // Check JWT token
    if (!isAuthorized && authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);
      if (payload && payload.role === 'admin') {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Invalid credentials.' }, { status: 401 });
    }

    const stats = await getStats();
    
    // Fetch count metadata from Supabase
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: referralsCount } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      stats,
      uptime: Date.now() - nodeStartTime,
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB'
      },
      counts: {
        referrals: referralsCount || 0,
        users: usersCount || 0
      }
    });
  } catch (err) {
    console.error("API stats retrieve error:", err.message);
    return NextResponse.json({ success: false, error: 'Failed to retrieve stats' }, { status: 500 });
  }
}


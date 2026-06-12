import { NextResponse } from 'next/server';
import { getStats } from '../../../../lib/analytics';
import db from '../../../../lib/db';
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

    const stats = getStats();
    
    // Fetch count metadata
    const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const referralsCount = db.prepare('SELECT COUNT(*) as count FROM referrals').get().count;

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
        referrals: referralsCount,
        users: usersCount
      }
    });
  } catch (err) {
    console.error("API stats retrieve error:", err.message);
    return NextResponse.json({ success: false, error: 'Failed to retrieve stats' }, { status: 500 });
  }
}

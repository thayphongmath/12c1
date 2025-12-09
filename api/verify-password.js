// Vercel Serverless Function để xác thực password
// Hash được lưu trong Vercel Environment Variable: AUTH_PASSWORD_HASH
// Hash của '123456': 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92

import crypto from 'crypto';

// ===== Token utilities (không cần KV) =====
const TOKEN_EXPIRE_MS = 60 * 60 * 1000; // 1 giờ

function base64url(input) {
    return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function signToken(payload, secret) {
    const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = base64url(JSON.stringify(payload));
    const data = `${header}.${body}`;
    const signature = crypto.createHmac('sha256', secret).update(data).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    return `${data}.${signature}`;
}

function createSessionToken(secret) {
    const payload = {
        ts: Date.now(),
        rnd: Math.random().toString(36).substring(2, 12)
    };
    return signToken(payload, secret);
}

// Không cần lưu vào KV; token được xác minh bằng chữ ký HMAC

// Bản đồ hash cho từng trang (đặt trong env, ví dụ AUTH_PASSWORD_HASH_LT)
const PAGE_HASH_ENV = {
    lt: 'AUTH_PASSWORD_HASH_LT',
    lpht: 'AUTH_PASSWORD_HASH_LPHT',
    lpld: 'AUTH_PASSWORD_HASH_LPLD',
    lppt: 'AUTH_PASSWORD_HASH_LPPT',
    lptt: 'AUTH_PASSWORD_HASH_LPTT',
    tt1: 'AUTH_PASSWORD_HASH_TT1',
    tt2: 'AUTH_PASSWORD_HASH_TT2',
    tt3: 'AUTH_PASSWORD_HASH_TT3',
    tt4: 'AUTH_PASSWORD_HASH_TT4',
    thuquy: 'AUTH_PASSWORD_HASH_THUQUY'
};

export default async function handler(req, res) {
    // CORS + preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Một số môi trường có thể để req.body là string
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (err) {
                return res.status(400).json({ error: 'Invalid JSON body' });
            }
        }

        const { password, page } = body || {};

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        // Chuẩn hóa page -> lowercase
        const pageKey = page ? String(page).trim().toLowerCase() : null;

        // Lấy hash tương ứng với trang nếu có chỉ định page, nếu không dùng hash mặc định
        let correctHash = process.env.AUTH_PASSWORD_HASH;
        if (pageKey) {
            const envKey = PAGE_HASH_ENV[pageKey];
            if (!envKey) {
                return res.status(400).json({ error: 'Invalid page identifier' });
            }
            correctHash = process.env[envKey];
        }

        if (!correctHash) {
            console.error('Password hash env is missing for page:', pageKey || 'default');
            return res.status(500).json({ error: 'Server configuration error (missing hash env)' });
        }

        // Hash password input bằng SHA-256 (sử dụng Node.js crypto)
        const inputHash = crypto.createHash('sha256').update(password).digest('hex');

        // So sánh hash
        if (inputHash === correctHash) {
            // Secret dùng để ký token: ưu tiên API_SECRET_KEY, fallback hash
            const secret = process.env.API_SECRET_KEY || correctHash;

            // Tạo session token đã ký HMAC (không cần KV)
            const sessionToken = createSessionToken(secret);

            return res.status(200).json({
                success: true,
                message: 'Authentication successful',
                sessionToken: sessionToken,
                expiresInMs: TOKEN_EXPIRE_MS
            });
        } else {
            return res.status(401).json({
                success: false,
                error: 'Invalid password'
            });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


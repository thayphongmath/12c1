// Vercel Serverless Function để quản lý thông tin phụ huynh
// Sử dụng Vercel KV để lưu trữ dữ liệu

import { kv } from '@vercel/kv';
import crypto from 'crypto';

// Helper function để kiểm tra KV có sẵn không
function isKvAvailable() {
    return process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
}

// ===== Token verify utilities (không cần KV) =====
const TOKEN_EXPIRE_MS = 60 * 60 * 1000; // 1 giờ

function base64urlDecode(str) {
    const pad = 4 - (str.length % 4 || 4);
    const normalized = str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad === 4 ? 0 : pad);
    return Buffer.from(normalized, 'base64').toString();
}

function verifySignedToken(token, secret) {
    if (!token || !secret) return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [header, body, signature] = parts;
    const data = `${header}.${body}`;
    const expected = crypto.createHmac('sha256', secret).update(data).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    if (expected !== signature) return false;
    try {
        const payload = JSON.parse(base64urlDecode(body));
        if (!payload.ts) return false;
        return Date.now() - payload.ts < TOKEN_EXPIRE_MS;
    } catch (e) {
        return false;
    }
}

// Helper function để lấy tất cả phụ huynh
async function getAllParents() {
    if (isKvAvailable()) {
        try {
            const parents = await kv.get('parents');
            if (parents && Array.isArray(parents) && parents.length > 0) {
                return parents;
            }
        } catch (error) {
            console.error('Error getting parents from KV:', error.message);
        }
    }
    // Nếu không có KV hoặc KV rỗng, trả về dữ liệu mặc định
    return getDefaultParents();
}

// Helper function để lưu danh sách phụ huynh
async function saveParents(parents) {
    if (isKvAvailable()) {
        try {
            await kv.set('parents', parents);
            return true;
        } catch (error) {
            console.error('Error saving parents to KV:', error.message);
            return false;
        }
    }
    // Nếu không có KV, không thể lưu
    console.warn('KV not available, cannot save parents');
    return false;
}

// Dữ liệu mặc định (fallback nếu không có KV)
function getDefaultParents() {
    return [
        { id: 1, name: 'Nguyễn Minh Anh', phone: '0913435735' },
        { id: 2, name: 'Nguyễn Thị Xuân Nhi', phone: '0979845064' },
        { id: 3, name: 'Trần Thị Cẩm Nhung', phone: '0338462618' },
        { id: 4, name: 'Trần Thị Thúy Quỳnh', phone: '0394569742' },
        { id: 5, name: 'Nguyễn Thị Tú Sương', phone: '0974647438' },
        { id: 6, name: 'Lê Đông Thy', phone: '0941102961' },
        { id: 7, name: 'Nguyễn Phạm Bảo Trân', phone: '0704960405' },
        { id: 8, name: 'Nguyễn Thị Kim Cương', phone: '0337653376' },
        { id: 9, name: 'Huỳnh Minh Tường', phone: '0355223252' },
        { id: 10, name: 'Nguyễn Thị Thúy Dương', phone: '0375181516' },
        { id: 11, name: 'Nguyễn Thành Đạt', phone: '0783593470' },
        { id: 12, name: 'Trần Tiến Đạt', phone: '0903063387' },
        { id: 13, name: 'Bùi Minh Đức', phone: '0942778792' },
        { id: 14, name: 'Trần Gia Huệ', phone: '0839537060' },
        { id: 15, name: 'Đinh Trung Kiên', phone: '0949766788' },
        { id: 16, name: 'Lê Thị Thúy Kiều', phone: '0333058596' },
        { id: 17, name: 'Lê Thị Thúy Kiều', phone: '0949524738' },
        { id: 18, name: 'Trần Nguyễn Hồng Lam', phone: '0838244117' },
        { id: 19, name: 'Nguyễn Thị Kiều Liên', phone: '0869866014' },
        { id: 20, name: 'Lê Ngọc Linh', phone: '0907017496' },
        { id: 21, name: 'Tăng Hoàng Trúc Linh', phone: '0975565173' },
        { id: 22, name: 'Trần Thanh Long', phone: '0834572795' },
        { id: 23, name: 'Nguyễn Kim Tường My', phone: '0939715735' },
        { id: 24, name: 'Phạm Thị Kim Ngọc', phone: '0367987744' },
        { id: 25, name: 'Nguyễn Thiện Nhân', phone: '0332108766' },
        { id: 26, name: 'Trần Ngọc Nhân', phone: '0965121532' },
        { id: 27, name: 'Trần Thị Yến Nhi', phone: '0774082097' },
        { id: 28, name: 'Bùi Thị Thiện Như', phone: '0392060050' },
        { id: 29, name: 'Bùi Trần Quỳnh Như', phone: '0798006204' },
        { id: 30, name: 'Phạm Minh Nhựt', phone: '0375184560' },
        { id: 31, name: 'Lê Minh Quí', phone: '0354328416' },
        { id: 32, name: 'Bùi Thị Kiều Quy', phone: '0907556190' },
        { id: 33, name: 'Nguyễn Thị Bích Thi', phone: '0354105424' },
        { id: 34, name: 'Trương Thị Bảo Thi', phone: '0332050667' },
        { id: 35, name: 'Nguyễn Đức Thịnh', phone: '0335776752' },
        { id: 36, name: 'Dương Ngọc Thư', phone: '0918995033' },
        { id: 37, name: 'Hồng Ngọc Anh Thư', phone: '0328294614' },
        { id: 38, name: 'Lê Văn Thuận', phone: '0352880444' },
        { id: 39, name: 'Lê Hoàng Bảo Thy', phone: '0364773451' },
        { id: 40, name: 'Nguyễn Thị Bảo Trăm', phone: '0795911384' },
        { id: 41, name: 'Nguyễn Thị Ngọc Trân', phone: '0939506247' },
        { id: 42, name: 'Lê Thị Như Ý', phone: '0365115444' },
        { id: 43, name: 'Lê Thị Ngọc Yến', phone: '0349951145' },
        { id: 44, name: 'Nguyễn Thị Thảo Vi', phone: '0975844458' },
        { id: 45, name: 'Nguyễn Trúc Đào', phone: '0907490838' },
        { id: 46, name: 'Nguyễn Thị Ánh Hồng', phone: '0372930413' },
        { id: 47, name: 'Hà Thị Tuyết My', phone: '0342237671' },
        { id: 48, name: 'Nguyễn Thị Kim Tiên', phone: '0977371318' }
    ];
}

// Helper function để kiểm tra authentication (bắt buộc token)
async function checkAuth(req) {
    const authHeader = req.headers['x-api-key'] || req.headers['authorization'];
    const apiKeyEnv = process.env.API_SECRET_KEY;

    // Không có header -> từ chối
    if (!authHeader) {
        return false;
    }

    // Parse token (Bearer hoặc plain)
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;

    // Ưu tiên xác minh token đã ký (không cần KV)
    const secretForVerify = apiKeyEnv || process.env.AUTH_PASSWORD_HASH;
    if (verifySignedToken(token, secretForVerify)) {
        return true;
    }

    // Nếu KV khả dụng: kiểm tra session token trong KV (legacy)
    if (isKvAvailable()) {
        try {
            const sessionKey = `session:${token}`;
            const sessionData = await kv.get(sessionKey);

            if (sessionData) {
                const sessionDuration = 60 * 60 * 1000; // 1 giờ
                if (Date.now() - sessionData.timestamp < sessionDuration) {
                    return true;
                }
                await kv.del(sessionKey);
            }
        } catch (error) {
            console.error('Error checking session:', error.message);
        }
    }

    // Fallback: cho phép nếu khớp API_SECRET_KEY (dạng plain)
    if (apiKeyEnv && token === apiKeyEnv) {
        return true;
    }

    return false;
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Kiểm tra authentication (trừ OPTIONS)
    const isAuthenticated = await checkAuth(req);
    if (!isAuthenticated) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized. Valid session token or API key required.'
        });
    }

    try {
        // GET: Lấy danh sách phụ huynh
        if (req.method === 'GET') {
            const parents = await getAllParents();
            return res.status(200).json({ success: true, data: parents });
        }

        // POST: Thêm phụ huynh mới
        if (req.method === 'POST') {
            const { name, phone } = req.body;

            if (!name || !phone) {
                return res.status(400).json({
                    success: false,
                    error: 'Name and phone are required'
                });
            }

            // Validate phone number (Vietnamese format)
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid phone number format'
                });
            }

            const parents = await getAllParents();

            // Tạo ID mới
            const newId = parents.length > 0
                ? Math.max(...parents.map(p => p.id || 0)) + 1
                : 1;

            const newParent = {
                id: newId,
                name: name.trim(),
                phone: phone.trim()
            };

            parents.push(newParent);
            const saved = await saveParents(parents);

            if (saved) {
                return res.status(201).json({
                    success: true,
                    message: 'Parent added successfully',
                    data: newParent
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to save parent'
                });
            }
        }

        // PUT: Cập nhật phụ huynh
        if (req.method === 'PUT') {
            const { id, name, phone } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID is required'
                });
            }

            if (!name || !phone) {
                return res.status(400).json({
                    success: false,
                    error: 'Name and phone are required'
                });
            }

            // Validate phone number
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid phone number format'
                });
            }

            const parents = await getAllParents();
            const index = parents.findIndex(p => p.id === parseInt(id));

            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Parent not found'
                });
            }

            parents[index] = {
                id: parseInt(id),
                name: name.trim(),
                phone: phone.trim()
            };

            const saved = await saveParents(parents);

            if (saved) {
                return res.status(200).json({
                    success: true,
                    message: 'Parent updated successfully',
                    data: parents[index]
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to update parent'
                });
            }
        }

        // DELETE: Xóa phụ huynh
        if (req.method === 'DELETE') {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID is required'
                });
            }

            const parents = await getAllParents();
            const filteredParents = parents.filter(p => p.id !== parseInt(id));

            if (filteredParents.length === parents.length) {
                return res.status(404).json({
                    success: false,
                    error: 'Parent not found'
                });
            }

            const saved = await saveParents(filteredParents);

            if (saved) {
                return res.status(200).json({
                    success: true,
                    message: 'Parent deleted successfully'
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to delete parent'
                });
            }
        }

        // Method not allowed
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });

    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
}


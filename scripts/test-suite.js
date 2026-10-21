/**
 * EduSkills-VN v2.0.0 — Automated Verification & Integration Test Suite
 * Chuẩn kiểm thử 4 tầng (SPEC -> PLAN -> TEST -> VERI):
 *   Suite 1: Dataset & 16-Skill UASS v2.0 Structural Verification
 *   Suite 2: OCR Parser & Regex Edge-Case Verification (Math/Physics/Chemistry/Dates/URLs/Units)
 *   Suite 3: 7-Pillar Universal Meta-Prompt Engine Verification (16 Skills x 3 Modes x 4 Tiers x 5 Contexts)
 *   Suite 4: REST API Server & Frontend Bundle Integration Tests (/api/skills, /api/ocr, /api/generate-prompt, web/index.html)
 */

const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const {
    formatMathToLatex,
    formatPhysicsToSI,
    formatChemistryToIUPAC,
    generateIntentDrivenPrompt,
    SKILL_DEEP_PROFILES,
    COMPETENCY_TIERS,
    USAGE_CONTEXTS
} = require('../backend/ocr-engine');

const { runValidation } = require('./validate-dataset');
const { buildAll } = require('./build-dataset');
const { server, lookupBookReference } = require('../server');

let passedTests = 0;
let failedTests = 0;
const failures = [];

function runTest(suiteName, testName, fn) {
    try {
        fn();
        passedTests++;
        console.log(`  ✅ [PASS] ${suiteName} :: ${testName}`);
    } catch (err) {
        failedTests++;
        failures.push({ suiteName, testName, error: err.message });
        console.error(`  ❌ [FAIL] ${suiteName} :: ${testName}\n     -> ${err.message}`);
    }
}

async function runAsyncTest(suiteName, testName, fn) {
    try {
        await fn();
        passedTests++;
        console.log(`  ✅ [PASS] ${suiteName} :: ${testName}`);
    } catch (err) {
        failedTests++;
        failures.push({ suiteName, testName, error: err.message });
        console.error(`  ❌ [FAIL] ${suiteName} :: ${testName}\n     -> ${err.message}`);
    }
}

function httpRequest(port, method, reqPath, body = null) {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : null;
        const req = http.request({
            hostname: '127.0.0.1',
            port,
            path: reqPath,
            method,
            headers: payload ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            } : {}
        }, (res) => {
            let raw = '';
            res.on('data', chunk => { raw += chunk; });
            res.on('end', () => {
                try {
                    resolve({ statusCode: res.statusCode, body: JSON.parse(raw) });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body: raw });
                }
            });
        });
        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

async function main() {
    console.log('================================================================================');
    console.log('🧪 EDUSKILLS-VN v2.0.0 — AUTOMATED TEST & VERIFICATION SUITE (SPEC->PLAN->TEST->VERI)');
    console.log('================================================================================\n');

    // =========================================================================
    // SUITE 1: DATASET & 16-SKILL UASS v2.0 VERIFICATION
    // =========================================================================
    console.log('📦 [SUITE 1] Kiểm định cấu trúc 16/16 SKILL.md & Dataset UASS v2.0...');
    const report = runValidation(true);

    runTest('Suite 1', 'Tổng số bộ kỹ năng đạt chuẩn 16/16', () => {
        assert.strictEqual(report.totalScanned, 16, `Kỳ vọng 16 skills, nhận được ${report.totalScanned}`);
        assert.strictEqual(report.validCount, 16, `Kỳ vọng 16 skills hợp lệ, nhận được ${report.validCount}`);
        assert.strictEqual(report.errorCount, 0, `Có lỗi cấu trúc: ${JSON.stringify(report.details.filter(d => !d.isValid))}`);
    });

    runTest('Suite 1', 'Cảnh báo chất lượng bằng 0 (Zero Warnings)', () => {
        assert.strictEqual(report.warningCount, 0, `Còn ${report.warningCount} cảnh báo`);
    });

    runTest('Suite 1', 'Tất cả 16 SKILL.md có dung lượng chuyên sâu >= 6,000 ký tự và đạt chuẩn v2.0.0', () => {
        for (const item of report.details) {
            assert.strictEqual(item.version, '2.0.0', `Skill ${item.name} chưa lên v2.0.0 (hiện tại: ${item.version})`);
            assert.ok(item.contentLength >= 6000, `Skill ${item.name} quá ngắn (${item.contentLength} chars < 6000)`);
            assert.strictEqual(item.hasUniversalPrompt, true, `Skill ${item.name} thiếu <universal_agentic_skill>`);
            assert.strictEqual(item.hasCoVe, true, `Skill ${item.name} thiếu <chain_of_verification>`);
            assert.strictEqual(item.hasTrapMatrix, true, `Skill ${item.name} thiếu Ma trận Bẫy nhận thức`);
        }
    });

    runTest('Suite 1', '100% Độc lập hệ sinh thái (Không chứa lệnh trói buộc CLI độc quyền trong SKILL.md)', () => {
        for (const item of report.details) {
            const fullPath = path.join(__dirname, '..', item.file);
            const raw = fs.readFileSync(fullPath, 'utf8');
            assert.ok(!raw.includes('gemini run --system-skill'), `Skill ${item.name} vẫn còn lệnh độc quyền gemini run --system-skill`);
            assert.ok(
                raw.includes('vendor_agnostic="true"') || raw.includes('ecosystem="vendor-agnostic"'),
                `Skill ${item.name} thiếu thuộc tính vendor-agnostic`
            );
        }
    });

    runTest('Suite 1', 'BOOKS_DATABASE phủ kín 16/16 kỹ năng cho cả 3 khối Lớp 10, 11, 12', () => {
        const booksDbPath = path.join(__dirname, '..', 'dataset', 'books-database.json');
        const booksDb = JSON.parse(fs.readFileSync(booksDbPath, 'utf8'));
        const skillIds = Object.keys(SKILL_DEEP_PROFILES);
        assert.strictEqual(skillIds.length, 16);
        for (const id of skillIds) {
            assert.ok(booksDb[id], `BOOKS_DATABASE thiếu ${id}`);
            for (const grade of ['10', '11', '12']) {
                assert.ok(Array.isArray(booksDb[id][grade]) && booksDb[id][grade].length > 0, `BOOKS_DATABASE[${id}][${grade}] rỗng`);
            }
        }
    });

    runTest('Suite 1', 'Build Pipeline tạo đầy đủ 4 gói artifacts (catalog, books, web/skills-data.js, universal-bundle)', () => {
        const buildRes = buildAll();
        assert.strictEqual(buildRes.universalBundle.totalSkills, 16);
        assert.ok(fs.existsSync(path.join(__dirname, '..', 'dataset', 'skills-catalog.json')), 'Thiếu dataset/skills-catalog.json');
        assert.ok(fs.existsSync(path.join(__dirname, '..', 'dataset', 'books-database.json')), 'Thiếu dataset/books-database.json');
        assert.ok(fs.existsSync(path.join(__dirname, '..', 'web', 'skills-data.js')), 'Thiếu web/skills-data.js');
        assert.ok(fs.existsSync(path.join(__dirname, '..', 'dataset', 'universal-prompts-bundle.json')), 'Thiếu dataset/universal-prompts-bundle.json');
    });

    // =========================================================================
    // SUITE 2: OCR PARSER & REGEX EDGE-CASE VERIFICATION
    // =========================================================================
    console.log('\n🔬 [SUITE 2] Kiểm thử OCR Engine & Regex Edge-Cases (Toán/Lý/Hóa/Ngày tháng/Đơn vị/URL)...');

    runTest('Suite 2', 'Biến đổi phân thức đại số (2x-1)/(x+1) sang LaTeX \\frac{2x-1}{x+1}', () => {
        const out = formatMathToLatex('Cho hàm số y = (2x-1)/(x+1) và f(x) = x/2');
        assert.ok(out.includes('\\frac{2x-1}{x+1}'), `Không thấy \\frac{2x-1}{x+1} trong: ${out}`);
        assert.ok(out.includes('\\frac{x}{2}'), `Không thấy \\frac{x}{2} trong: ${out}`);
    });

    runTest('Suite 2', 'Bảo toàn tuyệt đối ngày tháng lịch sử (6/3/1946, 20/10/2026) không bị biến thành \\frac', () => {
        const out = formatMathToLatex('Hiệp định Sơ bộ 6/3/1946 và ngày 20/10/2026');
        assert.ok(out.includes('6/3/1946'), `Ngày 6/3/1946 bị hỏng: ${out}`);
        assert.ok(out.includes('20/10/2026'), `Ngày 20/10/2026 bị hỏng: ${out}`);
        assert.ok(!out.includes('\\frac{6}{3}'), `Ngày bị biến thành phân số: ${out}`);
    });

    runTest('Suite 2', 'Bảo toàn tuyệt đối đơn vị đo lường (m/s, km/h, tạ/ha, 220/380V) và cụm từ Đúng/Sai', () => {
        const out = formatMathToLatex('Vận tốc 15 m/s (54 km/h), năng suất 65,2 tạ/ha, điện áp 220/380V, trắc nghiệm Đúng/Sai');
        assert.ok(out.includes('m/s'), `Đơn vị m/s bị hỏng: ${out}`);
        assert.ok(out.includes('km/h'), `Đơn vị km/h bị hỏng: ${out}`);
        assert.ok(out.includes('tạ/ha'), `Đơn vị tạ/ha bị hỏng: ${out}`);
        assert.ok(out.includes('220/380V'), `Điện áp 220/380V bị hỏng: ${out}`);
        assert.ok(out.includes('Đúng/Sai'), `Cụm Đúng/Sai bị hỏng: ${out}`);
    });

    runTest('Suite 2', 'Bảo toàn đường dẫn URL (https://drive.google.com/drive/folders/123)', () => {
        const url = 'https://drive.google.com/drive/folders/1x4vW2z692147';
        const out = formatMathToLatex(`Tài liệu tại ${url}`);
        assert.ok(out.includes(url), `URL bị hỏng: ${out}`);
    });

    runTest('Suite 2', 'Chuẩn hóa danh pháp Hóa học IUPAC 2018 chuẩn xác', () => {
        const out = formatChemistryToIUPAC('Cho sắt, nhôm và đồng tác dụng với axit sunfuric và glucozơ');
        assert.ok(out.includes('iron (Fe)'), `Thiếu iron (Fe): ${out}`);
        assert.ok(out.includes('aluminium (Al)'), `Thiếu aluminium (Al): ${out}`);
        assert.ok(out.includes('copper (Cu)'), `Thiếu copper (Cu): ${out}`);
        assert.ok(out.includes('sulfuric acid'), `Thiếu sulfuric acid: ${out}`);
        assert.ok(out.includes('glucose'), `Thiếu glucose: ${out}`);
    });

    runTest('Suite 2', 'Chuẩn hóa ký hiệu và đơn vị Vật lí chuẩn hệ SI', () => {
        const out = formatPhysicsToSI('Vận tốc v = 20 m/s, gia tốc a = 9.8 m/s2 ở nhiệt độ 300 K và 27 oC, áp suất 1000 Pa');
        assert.ok(out.includes('$\\text{m/s}$'), `Thiếu m/s SI: ${out}`);
        assert.ok(out.includes('$\\text{m/s}^2$'), `Thiếu m/s^2 SI: ${out}`);
        assert.ok(out.includes('300\\text{ K}'), `Thiếu 300 K SI: ${out}`);
        assert.ok(out.includes('27^\\circ\\text{C}'), `Thiếu 27 oC SI: ${out}`);
        assert.ok(out.includes('1000\\text{ Pa}'), `Thiếu 1000 Pa SI: ${out}`);
    });

    // =========================================================================
    // SUITE 3: 7-PILLAR UNIVERSAL META-PROMPT ENGINE & FRONTEND BUNDLE VERIFICATION
    // =========================================================================
    console.log('\n🏛️ [SUITE 3] Kiểm định Engine sinh Prompt 7 Trụ Cột & Frontend Web Bundle...');

    runTest('Suite 3', 'Tất cả 16 skills sinh đầy đủ 7 Trụ Cột ở chế độ Standard', () => {
        for (const skillId of Object.keys(SKILL_DEEP_PROFILES)) {
            const p = generateIntentDrivenPrompt({
                subject: skillId,
                gradeLevel: 12,
                competencyTier: 'vdc',
                usageContext: 'giai-de',
                exportMode: 'standard',
                verifiedContent: 'Bài toán kiểm thử tự động.'
            });
            assert.ok(p.includes('## 🎯 1. ĐỊNH VỊ NHẬN THỨC LUẬN'), `${skillId} thiếu Trụ cột 1`);
            assert.ok(p.includes('## 🧠 2. MÔ HÌNH HÓA NĂNG LỰC'), `${skillId} thiếu Trụ cột 2`);
            assert.ok(p.includes('## 🔄 3. QUY TRÌNH TƯ DUY BỘ MÔN'), `${skillId} thiếu Trụ cột 3`);
            assert.ok(p.includes('## ⚠️ 4. MA TRẬN BẪY NHẬN THỨC'), `${skillId} thiếu Trụ cột 4`);
            assert.ok(p.includes('## 📖 5. DẪN CHỨNG HỌC LIỆU & TRUNG THỰC NHẬN THỨC'), `${skillId} thiếu Trụ cột 5`);
            assert.ok(p.includes('## 🛡️ 6. MẪU NEO CHẤT LƯỢNG (FEW-SHOT EXEMPLAR) & GIAO THỨC TỰ KIỂM CHỨNG (CoVe)'), `${skillId} thiếu Trụ cột 6`);
            assert.ok(p.includes('## 📝 7.'), `${skillId} thiếu Trụ cột 7`);
            assert.ok(p.includes('Zero Fake-Citation'), `${skillId} thiếu quy tắc Epistemic Honesty`);
        }
    });

    runTest('Suite 3', 'Tất cả 16 skills sinh đúng cấu trúc XML <universal_agentic_prompt> ở chế độ system-prompt', () => {
        for (const skillId of Object.keys(SKILL_DEEP_PROFILES)) {
            const xml = generateIntentDrivenPrompt({
                subject: skillId,
                gradeLevel: 11,
                competencyTier: 'vd',
                usageContext: 'socrates',
                exportMode: 'system-prompt',
                verifiedContent: ''
            });
            assert.ok(xml.startsWith('<universal_agentic_prompt version="2.0.0" framework="EduSkills-VN" ecosystem="vendor-agnostic" standard="GDPT-2018-QD764">'));
            assert.ok(xml.includes('<epistemological_identity>'));
            assert.ok(xml.includes('<cognitive_calibration tier="vd" scenario="socrates">'));
            assert.ok(xml.includes('<cognitive_trap_matrix>'));
            assert.ok(xml.includes('<epistemic_grounding>'));
            assert.ok(xml.includes('<dynamic_few_shot_exemplar>'));
            assert.ok(xml.includes('<chain_of_verification_protocol>'));
            assert.ok(xml.endsWith('</universal_agentic_prompt>'));
        }
    });

    runTest('Suite 3', 'Chế độ agent-cli hoàn toàn độc lập hệ sinh thái (cURL REST API, Ollama, OpenAI-compatible)', () => {
        const cli = generateIntentDrivenPrompt({
            subject: 'tin-hoc-thpt',
            gradeLevel: 12,
            competencyTier: 'hsg',
            usageContext: 'chua-bay',
            exportMode: 'agent-cli',
            verifiedContent: 'Tìm đường đi ngắn nhất bằng Dijkstra.'
        });
        assert.ok(cli.includes('UNIVERSAL CLI & VENDOR-AGNOSTIC API EXECUTION'));
        assert.ok(cli.includes('http://localhost:3000/api/generate-prompt'));
        assert.ok(cli.includes('/v1/chat/completions'));
        assert.ok(!cli.includes('gemini run --system-skill'));
    });

    runTest('Suite 3', 'Tổ hợp 4 Cấp độ nhận thức (ZPD Tiers) x 5 Ngữ cảnh vận hành hoạt động chính xác', () => {
        for (const tierId of Object.keys(COMPETENCY_TIERS)) {
            for (const ctxId of Object.keys(USAGE_CONTEXTS)) {
                const out = generateIntentDrivenPrompt({
                    subject: 'toan-thpt',
                    gradeLevel: 12,
                    competencyTier: tierId,
                    usageContext: ctxId,
                    exportMode: 'standard'
                });
                assert.ok(out.includes(COMPETENCY_TIERS[tierId].name));
                assert.ok(out.includes(USAGE_CONTEXTS[ctxId].title));
            }
        }
    });

    runTest('Suite 3', 'Frontend Bundle web/skills-data.js và web/index.html (generatedPromptPayload) biên dịch & chạy không lỗi cú pháp', () => {
        const skillsDataJs = fs.readFileSync(path.join(__dirname, '..', 'web', 'skills-data.js'), 'utf8');
        const sandbox = { window: {} };
        vm.runInNewContext(skillsDataJs, sandbox);
        assert.strictEqual(sandbox.window.EDUSKILLS_CATALOG.length, 16);
        assert.strictEqual(Object.keys(sandbox.window.EDUSKILLS_DEEP_PROFILES).length, 16);

        const html = fs.readFileSync(path.join(__dirname, '..', 'web', 'index.html'), 'utf8');
        const startMarker = 'const generatedPromptPayload = useMemo(() => {';
        const endMarker = '}, [rolePrompt, gradeLevel, studentLevel';
        const sIdx = html.indexOf(startMarker);
        const eIdx = html.indexOf(endMarker);
        assert.ok(sIdx !== -1 && eIdx !== -1, 'Không tìm thấy generatedPromptPayload trong web/index.html');

        const fnBody = html.slice(sIdx + startMarker.length, eIdx);
        const fn = new Function(
            'DRIVE_LINKS_MAP', 'gradeLevel', 'currentBookObject', 'COMPETENCY_TIERS', 'competencyTier',
            'USAGE_CONTEXTS', 'usageContext', 'window', 'selectedSkillId', 'selectedSkill',
            'promptExportMode', 'rolePrompt', 'studentLevel', 'currentStatus', 'useFewShot',
            'constraintsPrompt', 'taskPrompt', 'docAttachment', 'useCoT', 'useSocratic', 'useActiveRecall',
            fnBody
        );

        for (const mode of ['standard', 'system-prompt', 'agent-cli']) {
            const out = fn(
                { 12: { url: 'https://drive.google.com' } },
                12,
                { title: 'SGK Toán 12', file: 'toan-12.pdf', drive: 'https://drive.google.com' },
                COMPETENCY_TIERS,
                'vd',
                USAGE_CONTEXTS,
                'giai-de',
                sandbox.window,
                'toan-thpt',
                { name: 'toan-thpt', category: 'khoa-hoc-tu-nhien' },
                mode,
                'Chuyên gia Toán',
                'Khá Giỏi',
                'Đang ôn thi',
                true,
                'LaTeX chuẩn',
                'Giải chi tiết',
                'Khảo sát hàm số y = x^3 - 3x',
                true,
                true,
                true
            );
            assert.ok(typeof out === 'string' && out.length > 200, `Output chế độ ${mode} không hợp lệ`);
        }
    });

    // =========================================================================
    // SUITE 4: BACKEND HTTP SERVER API INTEGRATION TESTS
    // =========================================================================
    console.log('\n🌐 [SUITE 4] Kiểm thử tích hợp HTTP REST API Endpoints...');

    await new Promise((resolve, reject) => {
        server.listen(0, '127.0.0.1', () => resolve());
        server.on('error', reject);
    });

    const address = server.address();
    const port = address.port;

    try {
        await runAsyncTest('Suite 4', 'GET /api/skills trả về 200 OK, đủ 16 skills', async () => {
            const res = await httpRequest(port, 'GET', '/api/skills');
            assert.strictEqual(res.statusCode, 200);
            assert.ok(Array.isArray(res.body));
            assert.strictEqual(res.body.length, 16);
        });

        await runAsyncTest('Suite 4', 'GET /api/validate trả về 200 OK, success = true, errorCount = 0', async () => {
            const res = await httpRequest(port, 'GET', '/api/validate');
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.errorCount, 0);
            assert.strictEqual(res.body.validCount, 16);
        });

        await runAsyncTest('Suite 4', 'GET /api/stats trả về 200 OK, version = 2.0.0, ecosystem = 100% Vendor-Agnostic', async () => {
            const res = await httpRequest(port, 'GET', '/api/stats');
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.version, '2.0.0');
            assert.ok(res.body.ecosystem.includes('Vendor-Agnostic'));
            assert.strictEqual(res.body.totalSkills, 16);
        });

        await runAsyncTest('Suite 4', 'GET /api/prompt-standard trả về tài liệu chuẩn 7 trụ cột v2.0.0', async () => {
            const res = await httpRequest(port, 'GET', '/api/prompt-standard');
            assert.strictEqual(res.statusCode, 200);
            assert.ok(typeof res.body === 'string' && res.body.includes('7 Trụ Cột'));
        });

        await runAsyncTest('Suite 4', 'POST /api/ocr xử lý chuẩn xác văn bản Toán + Bảo toàn ngày tháng & đơn vị', async () => {
            const res = await httpRequest(port, 'POST', '/api/ocr', {
                subject: 'toan-thpt',
                grade: 12,
                text: 'Ngày 20/10/2026, khảo sát hàm số y = (x+2)/(x-1) với vận tốc 10 m/s và điện áp 220/380V'
            });
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.body.success, true);
            assert.ok(res.body.formattedText.includes('\\frac{x+2}{x-1}'));
            assert.ok(res.body.formattedText.includes('20/10/2026'));
            assert.ok(res.body.formattedText.includes('m/s'));
            assert.ok(res.body.formattedText.includes('220/380V'));
        });

        await runAsyncTest('Suite 4', 'POST /api/generate-prompt sinh Prompt 7 trụ cột kèm tham chiếu SGK chính xác', async () => {
            const res = await httpRequest(port, 'POST', '/api/generate-prompt', {
                subject: 'vat-li-thpt',
                gradeLevel: 12,
                competencyTier: 'vdc',
                usageContext: 'giai-de',
                exportMode: 'standard',
                verifiedContent: 'Tính nhiệt lượng cần thiết để làm nóng chảy 2 kg nước đá ở 0°C.'
            });
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.body.success, true);
            assert.ok(res.body.prompt.includes('## 🎯 1. ĐỊNH VỊ NHẬN THỨC LUẬN'));
            assert.ok(res.body.prompt.includes('## 📝 7.'));
            assert.ok(res.body.prompt.includes('Vật lí 12'));
        });

        await runAsyncTest('Suite 4', 'GET /api/unknown-route trả về 404 Not Found với cấu trúc lỗi chuẩn', async () => {
            const res = await httpRequest(port, 'GET', '/api/unknown-route');
            assert.strictEqual(res.statusCode, 404);
            assert.strictEqual(res.body.success, false);
            assert.strictEqual(res.body.error.code, 'ROUTE_NOT_FOUND');
        });
    } finally {
        await new Promise((resolve) => server.close(() => resolve()));
    }

    console.log('\n================================================================================');
    console.log(`🏁 KẾT QUẢ KIỂM THỬ TỔNG HỢP: ${passedTests} PASSED | ${failedTests} FAILED`);
    console.log('================================================================================');

    if (failedTests > 0) {
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('Lỗi hệ thống khi chạy Test Suite:', err);
    process.exit(1);
});

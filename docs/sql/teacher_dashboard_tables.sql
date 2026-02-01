-- ============================================
-- Future Navigator 教师界面数据库表结构
-- ============================================
-- 创建时间: 2026-01-30
-- 说明: 用于支持教师管理班级、学生、视频分析等功能
-- ============================================

-- ============================================
-- 1. classes 表 - 班级表
-- ============================================
-- 用途: 存储班级信息
-- 数据: 结构化数据（班级名称、创建时间等）
-- 关联: 一个教师对应一个班级（简化设计）
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(teacher_id) -- 确保一个教师只有一个班级
);

-- ============================================
-- 2. students 表 - 学生表
-- ============================================
-- 用途: 存储学生信息
-- 数据: 结构化数据（学生姓名、学号等）
-- 关联: 多个学生属于一个班级
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    student_number VARCHAR(50),
    avatar_url TEXT, -- 头像 URL（可选，存储在 Blob）
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. videos 表 - 视频表
-- ============================================
-- 用途: 存储视频元数据
-- 数据: 结构化数据（视频 URL、状态等）
-- 关联: 多个视频属于一个学生
-- 注意: 视频文件本身存储在 Vercel Blob，这里只存储 URL 和元数据
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    blob_url TEXT NOT NULL, -- Vercel Blob 存储的 URL
    title VARCHAR(200),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    duration_seconds INTEGER, -- 视频时长（秒）
    file_size BIGINT, -- 文件大小（字节）
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. analysis_reports 表 - 分析报告表
-- ============================================
-- 用途: 存储 AI 生成的分析报告
-- 数据: 结构化数据（报告类型、内容等）
-- 关联: 报告属于一个学生，可能关联一个视频（单次分析）或不关联（季度总结）
-- 注意: 报告内容可以存储为 JSON 或 TEXT，根据实际需求选择
CREATE TABLE IF NOT EXISTS analysis_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE SET NULL, -- 可选，单次视频分析时关联
    report_type VARCHAR(20) NOT NULL CHECK (report_type IN ('single', 'quarterly', 'custom')),
    title VARCHAR(200),
    content JSONB, -- 存储报告的结构化内容（JSON 格式）
    summary TEXT, -- 报告摘要（文本格式）
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. student_errors 表 - 学生错误记录表
-- ============================================
-- 用途: 存储从视频分析中提取的语法和发音错误
-- 数据: 结构化数据（错误类型、内容、频率等）
-- 关联: 错误属于一个学生，可能关联一个视频
CREATE TABLE IF NOT EXISTS student_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE SET NULL, -- 可选，记录错误来源
    error_type VARCHAR(20) NOT NULL CHECK (error_type IN ('grammar', 'pronunciation', 'vocabulary', 'other')),
    error_content TEXT NOT NULL, -- 错误的原始内容
    correct_content TEXT NOT NULL, -- 正确的内容
    frequency INTEGER DEFAULT 1, -- 该错误出现的频率
    context TEXT, -- 错误出现的上下文
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, error_content, error_type) -- 同一学生的相同错误只记录一次，通过 frequency 累加
);

-- ============================================
-- 6. student_radar_data 表 - 雷达图数据表
-- ============================================
-- 用途: 存储学生的 6 维度能力评估数据
-- 数据: 结构化数据（6 个维度的分数）
-- 关联: 数据属于一个学生，可能关联一个视频（单次分析）或不关联（综合评估）
-- 说明: 每次工作坊或视频分析后更新雷达图数据
CREATE TABLE IF NOT EXISTS student_radar_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE SET NULL, -- 可选，单次视频分析的数据
    -- 6 个维度的分数（0-100）
    language_application INTEGER DEFAULT 0 CHECK (language_application >= 0 AND language_application <= 100),
    communication_collaboration INTEGER DEFAULT 0 CHECK (communication_collaboration >= 0 AND communication_collaboration <= 100),
    problem_solving INTEGER DEFAULT 0 CHECK (problem_solving >= 0 AND problem_solving <= 100),
    proactive_exploration INTEGER DEFAULT 0 CHECK (proactive_exploration >= 0 AND proactive_exploration <= 100),
    creative_expression INTEGER DEFAULT 0 CHECK (creative_expression >= 0 AND creative_expression <= 100),
    intrinsic_motivation INTEGER DEFAULT 0 CHECK (intrinsic_motivation >= 0 AND intrinsic_motivation <= 100),
    recorded_at TIMESTAMPTZ DEFAULT NOW(), -- 数据记录时间
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. class_summaries 表 - 班级摘要表
-- ============================================
-- 用途: 存储 AI 生成的班级摘要（用于班级概况页面的摘要卡片）
-- 数据: 结构化数据（摘要内容、生成时间等）
-- 关联: 摘要属于一个班级
-- 说明: 定期（如每天或每周）由 AI 生成新的摘要
CREATE TABLE IF NOT EXISTS class_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    summary_content TEXT NOT NULL, -- AI 生成的摘要内容
    generated_at TIMESTAMPTZ DEFAULT NOW(), -- 摘要生成时间
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 索引创建
-- ============================================
-- 为常用查询字段创建索引，提高查询性能

-- classes 表索引
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);

-- students 表索引
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);

-- videos 表索引
CREATE INDEX IF NOT EXISTS idx_videos_student_id ON videos(student_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

-- analysis_reports 表索引
CREATE INDEX IF NOT EXISTS idx_analysis_reports_student_id ON analysis_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_video_id ON analysis_reports(video_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_type ON analysis_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_created_at ON analysis_reports(created_at DESC);

-- student_errors 表索引
CREATE INDEX IF NOT EXISTS idx_student_errors_student_id ON student_errors(student_id);
CREATE INDEX IF NOT EXISTS idx_student_errors_video_id ON student_errors(video_id);
CREATE INDEX IF NOT EXISTS idx_student_errors_type ON student_errors(error_type);

-- student_radar_data 表索引
CREATE INDEX IF NOT EXISTS idx_student_radar_data_student_id ON student_radar_data(student_id);
CREATE INDEX IF NOT EXISTS idx_student_radar_data_video_id ON student_radar_data(video_id);
CREATE INDEX IF NOT EXISTS idx_student_radar_data_recorded_at ON student_radar_data(recorded_at DESC);

-- class_summaries 表索引
CREATE INDEX IF NOT EXISTS idx_class_summaries_class_id ON class_summaries(class_id);
CREATE INDEX IF NOT EXISTS idx_class_summaries_generated_at ON class_summaries(generated_at DESC);

-- ============================================
-- 更新时间触发器函数（如果还没有）
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表添加更新时间触发器
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_errors_updated_at BEFORE UPDATE ON student_errors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) 策略
-- ============================================
-- 启用 RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_radar_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_summaries ENABLE ROW LEVEL SECURITY;

-- classes 表策略：教师只能访问自己的班级
CREATE POLICY "教师只能访问自己的班级" ON classes
    FOR ALL USING (
        teacher_id = auth.uid()::uuid OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin')
    );

-- students 表策略：教师只能访问自己班级的学生
CREATE POLICY "教师只能访问自己班级的学生" ON students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM classes 
            WHERE classes.id = students.class_id 
            AND classes.teacher_id = auth.uid()::uuid
        ) OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin')
    );

-- videos 表策略：教师只能访问自己班级学生的视频
CREATE POLICY "教师只能访问自己班级学生的视频" ON videos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM students 
            JOIN classes ON students.class_id = classes.id
            WHERE students.id = videos.student_id 
            AND classes.teacher_id = auth.uid()::uuid
        ) OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin')
    );

-- analysis_reports 表策略：教师只能访问自己班级学生的报告
CREATE POLICY "教师只能访问自己班级学生的报告" ON analysis_reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM students 
            JOIN classes ON students.class_id = classes.id
            WHERE students.id = analysis_reports.student_id 
            AND classes.teacher_id = auth.uid()::uuid
        ) OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin')
    );

-- student_errors 表策略：教师只能访问自己班级学生的错误记录
CREATE POLICY "教师只能访问自己班级学生的错误记录" ON student_errors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM students 
            JOIN classes ON students.class_id = classes.id
            WHERE students.id = student_errors.student_id 
            AND classes.teacher_id = auth.uid()::uuid
        ) OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin')
    );

-- student_radar_data 表策略：教师只能访问自己班级学生的雷达图数据
CREATE POLICY "教师只能访问自己班级学生的雷达图数据" ON student_radar_data
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM students 
            JOIN classes ON students.class_id = classes.id
            WHERE students.id = student_radar_data.student_id 
            AND classes.teacher_id = auth.uid()::uuid
        ) OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin')
    );

-- class_summaries 表策略：教师只能访问自己班级的摘要
CREATE POLICY "教师只能访问自己班级的摘要" ON class_summaries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM classes 
            WHERE classes.id = class_summaries.class_id 
            AND classes.teacher_id = auth.uid()::uuid
        ) OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin')
    );

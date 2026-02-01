CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(teacher_id)
);

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    student_number VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    blob_url TEXT NOT NULL,
    title VARCHAR(200),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    duration_seconds INTEGER,
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analysis_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
    report_type VARCHAR(20) NOT NULL CHECK (report_type IN ('single', 'quarterly', 'custom')),
    title VARCHAR(200),
    content JSONB,
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
    error_type VARCHAR(20) NOT NULL CHECK (error_type IN ('grammar', 'pronunciation', 'vocabulary', 'other')),
    error_content TEXT NOT NULL,
    correct_content TEXT NOT NULL,
    frequency INTEGER DEFAULT 1,
    context TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, error_content, error_type)
);

CREATE TABLE IF NOT EXISTS student_radar_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
    language_application INTEGER DEFAULT 0 CHECK (language_application >= 0 AND language_application <= 100),
    communication_collaboration INTEGER DEFAULT 0 CHECK (communication_collaboration >= 0 AND communication_collaboration <= 100),
    problem_solving INTEGER DEFAULT 0 CHECK (problem_solving >= 0 AND problem_solving <= 100),
    proactive_exploration INTEGER DEFAULT 0 CHECK (proactive_exploration >= 0 AND proactive_exploration <= 100),
    creative_expression INTEGER DEFAULT 0 CHECK (creative_expression >= 0 AND creative_expression <= 100),
    intrinsic_motivation INTEGER DEFAULT 0 CHECK (intrinsic_motivation >= 0 AND intrinsic_motivation <= 100),
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS class_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    summary_content TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
CREATE INDEX IF NOT EXISTS idx_videos_student_id ON videos(student_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_student_id ON analysis_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_video_id ON analysis_reports(video_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_type ON analysis_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_created_at ON analysis_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_errors_student_id ON student_errors(student_id);
CREATE INDEX IF NOT EXISTS idx_student_errors_video_id ON student_errors(video_id);
CREATE INDEX IF NOT EXISTS idx_student_errors_type ON student_errors(error_type);
CREATE INDEX IF NOT EXISTS idx_student_radar_data_student_id ON student_radar_data(student_id);
CREATE INDEX IF NOT EXISTS idx_student_radar_data_video_id ON student_radar_data(video_id);
CREATE INDEX IF NOT EXISTS idx_student_radar_data_recorded_at ON student_radar_data(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_class_summaries_class_id ON class_summaries(class_id);
CREATE INDEX IF NOT EXISTS idx_class_summaries_generated_at ON class_summaries(generated_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_errors_updated_at BEFORE UPDATE ON student_errors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_radar_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "教师只能访问自己的班级" ON classes
    FOR ALL USING (
        teacher_id = auth.uid()::uuid OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin')
    );

CREATE POLICY "教师只能访问自己班级的学生" ON students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM classes 
            WHERE classes.id = students.class_id 
            AND classes.teacher_id = auth.uid()::uuid
        ) OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin')
    );

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

CREATE POLICY "教师只能访问自己班级的摘要" ON class_summaries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM classes 
            WHERE classes.id = class_summaries.class_id 
            AND classes.teacher_id = auth.uid()::uuid
        ) OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin')
    );

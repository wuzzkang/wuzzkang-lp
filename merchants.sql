-- Buat tabel merchants
CREATE TABLE public.merchants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    custom_domain TEXT UNIQUE,
    nama_toko TEXT NOT NULL,
    deskripsi TEXT,
    logo_url TEXT,
    theme_color TEXT,
    facebook_pixel_id TEXT,
    page_config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index tambahan untuk mempercepat pencarian berdasarkan slug atau custom_domain
CREATE INDEX idx_merchants_slug ON public.merchants(slug);
CREATE INDEX idx_merchants_custom_domain ON public.merchants(custom_domain);

-- Atur Row Level Security (RLS)
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;

-- Buat policy agar data dapat dibaca oleh publik (anon)
CREATE POLICY "Enable read access for all users" ON public.merchants
    AS PERMISSIVE FOR SELECT
    TO public
    USING (true);

-- (Opsional) Trigger untuk update updated_at otomatis setiap ada perubahan row
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_merchants_updated_at
    BEFORE UPDATE ON public.merchants
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

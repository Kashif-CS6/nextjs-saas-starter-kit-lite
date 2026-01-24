
DROP POLICY IF EXISTS "Anyone can read blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can update their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can delete their own posts" ON blog_posts;


CREATE POLICY "enable_read_for_all" 
ON blog_posts FOR SELECT 
USING (true);

CREATE POLICY "enable_insert_for_authenticated" 
ON blog_posts FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.uid() = author_id
);

CREATE POLICY "enable_update_for_authors" 
ON blog_posts FOR UPDATE 
TO authenticated 
USING (
  auth.uid() = author_id
) 
WITH CHECK (
  auth.uid() = author_id
);

CREATE POLICY "enable_delete_for_authors" 
ON blog_posts FOR DELETE 
TO authenticated 
USING (
  auth.uid() = author_id
);

COMMENT ON TABLE blog_posts IS 'Blog posts with proper RLS policies:
- Public read access
- Authenticated users can create posts (must be author)
- Users can only update/delete their own posts';
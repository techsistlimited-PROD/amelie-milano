-- Increase CMS image upload limit to 20 MB (was 5 MB)
update storage.buckets
set file_size_limit = 20971520
where id = 'cms-media';

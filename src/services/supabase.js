import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wdvterwwuugpxasfylwu.supabase.co";
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdnRlcnd3dXVncHhhc2Z5bHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEwNzc2MTgsImV4cCI6MjAwNjY1MzYxOH0.bPzou598gFPev84_nXeo1lGOPFJ5VKkiKfJZXH_8oFA`;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

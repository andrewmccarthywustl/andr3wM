// Add a movie review
const addMovieReview = async (reviewData) => {
  const { data, error } = await supabase
    .from("movie_reviews")
    .insert([reviewData]);
  if (error) console.log("error", error);
  else console.log("Added review", data);
};

// Fetch published blog posts
const fetchPublishedBlogPosts = async () => {
  let { data: blogPosts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true);
  if (error) console.log("error", error);
  else console.log("blogPosts", blogPosts);
};

// Add a blog post
const addBlogPost = async (postData) => {
  const { data, error } = await supabase.from("blog_posts").insert([postData]);
  if (error) console.log("error", error);
  else console.log("Added post", data);
};

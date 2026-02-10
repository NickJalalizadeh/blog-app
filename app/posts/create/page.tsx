import CreateBlogForm from "@/components/CreateBlogForm";

export default async function CreatePostPage() {
  return (
    <>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-8">
        Create Post
      </h1>
      <CreateBlogForm />
    </>
  );
}
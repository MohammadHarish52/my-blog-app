import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";

type LoaderData = {
  posts: Array<{
    id: string;
    title: string;
    createdAt: string;
    imageUrl?: string;
  }>;
};

export const loader: LoaderFunction = async () => {
  const posts = await db.post.findMany({
    select: { id: true, title: true, createdAt: true, imageUrl: true },
    orderBy: { createdAt: "desc" },
  });
  return json({ posts });
};

export default function Index() {
  const { posts } = useLoaderData<LoaderData>();

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>My Blog</CardTitle>
        <Button asChild>
          <Link to="/posts/new">Create New Post</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id}>
              <Card>
                <CardContent className="p-4 flex items-center">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                  )}
                  <div className="flex-grow">
                    <Link
                      to={`/posts/${post.id}`}
                      className="text-lg font-semibold hover:underline"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

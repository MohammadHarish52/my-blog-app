import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";

export const loader: LoaderFunction = async ({ params }) => {
  const post = await db.post.findUnique({ where: { id: params.postId } });
  if (!post) throw new Response("Not Found", { status: 404 });
  return { post };
};

export default function PostDetail() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-1 h-4 w-4" />
          {new Date(post.createdAt).toLocaleString()}
        </div>
      </CardHeader>
      <CardContent>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-auto mb-4 rounded-md"
          />
        )}
        <div className="prose">{post.content}</div>
        <div className="mt-4">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

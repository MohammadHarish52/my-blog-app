import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

export const loader: LoaderFunction = async ({ params }) => {
  const post = await db.post.findUnique({ where: { id: params.postId } });
  if (!post) throw new Response("Not Found", { status: 404 });
  return { post };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof title !== "string" || typeof content !== "string") {
    return { error: "Invalid form data" };
  }

  await db.post.update({
    where: { id: params.postId },
    data: { title, content },
  });

  return redirect(`/posts/${params.postId}`);
};

export default function EditPost() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Edit Post</CardTitle>
      </CardHeader>
      <CardContent>
        <Form method="post" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              defaultValue={post.title}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={post.content}
              required
            />
          </div>
          <Button type="submit">Update Post</Button>
        </Form>
      </CardContent>
    </Card>
  );
}

import { json, redirect, type ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { uploadImage } from "~/utils/imageUpload.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const image = formData.get("image") as File;

  if (typeof title !== "string" || typeof content !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  let imageUrl = null;
  if (image && image.size > 0) {
    try {
      imageUrl = await uploadImage(image);
    } catch (error) {
      console.error("Image upload failed:", error);
      return json({ error: "Image upload failed" }, { status: 500 });
    }
  }

  try {
    const post = await db.post.create({
      data: { title, content, imageUrl },
    });
    return redirect(`/posts/${post.id}`);
  } catch (error) {
    console.error("Failed to create post:", error);
    return json({ error: "Failed to create post" }, { status: 500 });
  }
};

export default function NewPost() {
  const actionData = useActionData<typeof action>();

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <Form method="post" encType="multipart/form-data" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input type="text" id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" name="content" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" name="image" accept="image/*" />
          </div>
          {actionData?.error && (
            <p className="text-red-500">{actionData.error}</p>
          )}
          <Button type="submit">Create Post</Button>
        </Form>
      </CardContent>
    </Card>
  );
}

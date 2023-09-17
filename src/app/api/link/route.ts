import axios from "axios";
import { NextRequest } from "next/server";

const handler = async (req: NextRequest) => {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new Response(
      JSON.stringify({
        success: 0,
        message: "URL parameter is missing.",
      }),
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(url);
    const html = response.data;

    const titleMatch = /<title>(.*?)<\/title>/.exec(html);
    const title = titleMatch ? titleMatch[1] : null;

    const descriptionMatch =
      /<meta\s+name=["']description["']\s+content=["'](.*?)["']\s*\/?>/.exec(
        html
      );
    const description = descriptionMatch ? descriptionMatch[1] : null;

    const imageMatch =
      /<meta\s+property=["']og:image["']\s+content=["'](.*?)["']\s*\/?>/.exec(
        html
      );
    const image = imageMatch ? imageMatch[1] : null;

    return new Response(
      JSON.stringify({
        success: 1,
        link: url,
        meta: {
          title,
          description,
          image,
        },
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: 0,
        message: "Something went wrong.",
      }),
      { status: 500 }
    );
  }
};

export { handler as GET };

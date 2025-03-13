import { NextRequest, NextResponse } from 'next/server';

// Secret token to validate the request
const REVALIDATION_TOKEN = process.env.REVALIDATION_TOKEN || 'your-secret-token';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, slug } = body;

    // Validate the token
    if (token !== REVALIDATION_TOKEN) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Trigger a Netlify build hook
    const NETLIFY_BUILD_HOOK = process.env.NETLIFY_BUILD_HOOK;
    
    if (!NETLIFY_BUILD_HOOK) {
      return NextResponse.json(
        { message: 'Netlify build hook not configured' },
        { status: 500 }
      );
    }

    // Call the Netlify build hook
    const response = await fetch(NETLIFY_BUILD_HOOK, {
      method: 'POST',
      body: JSON.stringify({
        clear_cache: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to trigger Netlify build: ${response.statusText}`);
    }

    return NextResponse.json({ 
      message: 'Revalidation triggered successfully',
      slug
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error triggering revalidation' },
      { status: 500 }
    );
  }
} 
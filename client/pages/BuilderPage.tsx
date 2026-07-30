import { useEffect, useState } from "react";
import { Content } from "@builder.io/sdk-react";
import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BUILDER_API_KEY, BUILDER_PAGE_MODEL, fetchBuilderPage, isBuilderConfigured } from "@/lib/builder";

const BuilderPage = () => {
  const location = useLocation();
  const [content, setContent] = useState<Awaited<ReturnType<typeof fetchBuilderPage>>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchBuilderPage(location.pathname).then((result) => {
      if (active) {
        setContent(result);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  if (loading && isBuilderConfigured) {
    return <div className="min-h-screen bg-ivory" aria-busy="true" />;
  }

  if (content) {
    return <Content content={content} apiKey={BUILDER_API_KEY} model={BUILDER_PAGE_MODEL} />;
  }

  return (
    <div className="min-h-screen bg-ivory text-stone-900">
      <Header />
      <main className="container mx-auto flex min-h-[55vh] items-center justify-center px-4 py-20 text-center">
        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-teal">Amelie Milano CMS</p>
          <h1 className="font-serif text-5xl">Page unavailable</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-stone-600">
            {isBuilderConfigured ? "This page has not been published in Builder yet." : "Connect a Builder public API key to publish CMS pages here."}
          </p>
          <Link to="/" className="btn-primary mt-8 inline-flex">Return Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BuilderPage;

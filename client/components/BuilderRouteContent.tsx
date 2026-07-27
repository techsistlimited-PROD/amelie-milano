import { Content } from "@builder.io/sdk-react";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { BUILDER_API_KEY, BUILDER_PAGE_MODEL, fetchBuilderPage } from "@/lib/builder";

interface BuilderRouteContentProps {
  children: ReactNode;
}

const BuilderRouteContent = ({ children }: BuilderRouteContentProps) => {
  const location = useLocation();
  const [content, setContent] = useState<Awaited<ReturnType<typeof fetchBuilderPage>>>(null);

  useEffect(() => {
    let active = true;
    setContent(null);
    fetchBuilderPage(location.pathname).then((result) => {
      if (active) setContent(result);
    });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  if (content) {
    return <Content content={content} apiKey={BUILDER_API_KEY} model={BUILDER_PAGE_MODEL} />;
  }

  return <>{children}</>;
};

export default BuilderRouteContent;

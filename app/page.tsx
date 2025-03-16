import Hero_L from "@/components/Hero";
export default function Home() {
  return (
    <>
    <Hero_L
        name="codeadpool"
        title="Electrical Engineer"
        description="Like to build and test things. Trying to blog"
        ctaPrimary={{
          text: "View Projects",
          href: "/projects"
        }}
        ctaSecondary={{
          text: "Technical Blog",
          href: "/hardware-blog"
        }}
      />
    </>
  );
}

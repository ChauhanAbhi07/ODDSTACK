import { ButtonLink, PageIntro } from "@/components/ui";
export default function NotFound() {
  return (
    <>
      <PageIntro
        label="404 / Missing piece"
        title="This piece isn't in the stack."
        description="The page may have moved, or it isn't published yet. Let's get you somewhere useful."
      />
      <div className="container section-bottom">
        <ButtonLink href="/">Back to the stack</ButtonLink>
      </div>
    </>
  );
}

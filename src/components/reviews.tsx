import { publishedReviews } from "@/data/reviews";
import { SectionTitle } from "./ui";
import styles from "@/app/home.module.css";

export function Reviews() {
  if (!publishedReviews.length) return null;
  return (
    <section className={`container ${styles.section}`} id="reviews">
      <SectionTitle
        eyebrow="Customer reviews"
        title="In our customers’ words."
      />
      <div className={styles.reviewGrid}>
        {publishedReviews.slice(0, 3).map((review) => (
          <figure key={review.id} className={styles.review}>
            <blockquote>
              <p>“{review.quote}”</p>
            </blockquote>
            <figcaption>
              <strong>{review.name}</strong>
              <span>{review.context}</span>
            </figcaption>
            {review.sourceUrl && (
              <a href={review.sourceUrl} className="text-link">
                Read original review
                <span className={styles.srOnly}> from {review.name}</span>
              </a>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

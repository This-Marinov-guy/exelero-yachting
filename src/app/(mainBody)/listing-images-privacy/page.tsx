import type { Metadata } from "next";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Listing images and Google Drive privacy",
  description: "How Exelero Yachting uses Google Drive to store and display yacht listing images.",
};

export default function ListingImagesPrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Exelero Yachting · Google Drive integration</p>
        <h1>Listing images and Google Drive privacy</h1>
        <p className={styles.intro}>
          This notice explains how the Exelero Yachting Listing Images app uses Google Drive.
          It applies to the Google account that authorizes the app to manage yacht listing photos.
        </p>

        <section aria-labelledby="access">
          <h2 id="access">Drive access</h2>
          <p>
            The app requests the Google Drive <code>drive.file</code> permission. This lets it create,
            view, update, and delete files it uses. The app uses that permission to upload listing
            images to the designated Exelero Yachting folder and manage those images. It does not
            request permission to browse unrelated Drive files.
          </p>
        </section>

        <section aria-labelledby="photos">
          <h2 id="photos">Public listing photos</h2>
          <p>
            Images uploaded for yacht listings are intended for public display on the Exelero
            Yachting website. The website retrieves them from Google Drive through its image
            service and may cache optimized copies to load pages faster. The designated Drive
            folder may also be publicly viewable. Do not upload private photos to a listing.
          </p>
        </section>

        <section aria-labelledby="credentials">
          <h2 id="credentials">Authorization and storage</h2>
          <p>
            The app stores the authorization needed for server-side uploads as an encrypted
            production secret. The authorization is used for listing-image operations and is not
            shown to website visitors. Google Drive stores the image files; the website hosting
            provider processes and caches image responses. We do not sell Google user data or use
            it for advertising.
          </p>
        </section>

        <section aria-labelledby="control">
          <h2 id="control">Your control</h2>
          <p>
            The Google account owner can revoke this app&apos;s Drive access in their Google Account
            settings. Revoking access stops future authorized uploads but does not automatically
            delete images already stored in Drive. The Drive owner can remove those files from
            the designated folder. Listing administrators can remove individual images from
            listings.
          </p>
        </section>

        <section aria-labelledby="contact">
          <h2 id="contact">Questions</h2>
          <p>
            For questions about this Drive integration or a request concerning listing images,
            email <a href="mailto:exelerodev@gmail.com">exelerodev@gmail.com</a>.
          </p>
        </section>

        <p className={styles.updated}>Last updated 17 October 2026</p>
      </div>
    </main>
  );
}

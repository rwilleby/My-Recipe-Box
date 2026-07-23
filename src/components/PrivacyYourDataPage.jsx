const SUMMARY_ITEMS = [
  "No visitor account required",
  "No visitor email address required",
  "No visitor password required",
  "No subscription required",
  "No payment required to use the public recipe website",
  "Supported personal Recipe Box information stays in the browser",
  "Backup files are created on the visitor’s device",
  "Restore files are processed in the visitor’s browser",
  "Browser data can be lost if it is cleared",
  "Visitors control where backup files are stored",
  "Outside websites follow their own privacy practices",
  "No website or device can promise absolute security",
];

function PrivacySection({ title, children }) {
  return (
    <section className="privacyDataSection">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function PrivacyYourDataPage({ setActivePage }) {
  function openRecipeBoxData() {
    setActivePage("Favorites");
    window.setTimeout(() => {
      document.getElementById("your-recipe-box-data")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  return (
    <main className="pageShell privacyDataPage">
      <div className="privacyDataContent">
        <PrivacySection title="A Privacy-First Recipe Website">
          <p>Robert’s Recipe Box was designed to give visitors useful recipe-planning tools without requiring an account, subscription, email address, or password.</p>
          <p>You can browse recipes and use supported personal features without creating a profile or giving us identifying information. Our goal is to offer a useful, welcoming website with as few strings attached as possible.</p>
          <p>Whenever practical, personal Recipe Box information is stored in your own browser instead of being placed in a Robert’s Recipe Box visitor-account database.</p>
        </PrivacySection>

        <PrivacySection title="No Visitor Account Required">
          <p>You do not need to create an account to use Robert’s Recipe Box. We do not require you to provide:</p>
          <ul>
            <li>Your name</li><li>An email address</li><li>A username</li><li>A visitor password</li><li>A mailing address</li><li>Payment information</li><li>Subscription information</li>
          </ul>
          <p>The public recipe website is intended to remain free to use without a required sign-in. Administrative tools used by the website owner are separate from ordinary visitor features and do not require visitors to create an account.</p>
        </PrivacySection>

        <PrivacySection title="Information Saved in Your Browser">
          <p>Some personal website features save information directly in the browser you are using. Depending on the features available, this can include:</p>
          <ul>
            <li>Favorite recipes and Combo-Meals</li><li>Checked grocery items and shopping comments</li><li>Meal plans and serving-size selections</li><li>Pantry, refrigerator, and freezer information</li><li>Prepared-food inventory and reservations</li><li>Product category assignments and Recipe Box settings</li><li>Other supported data stored with a Robert’s Recipe Box browser-storage key</li>
          </ul>
          <p>This information is connected to the particular browser and device where it was created. Information saved in Safari on one computer will not automatically appear in Chrome, on another computer, or on a phone.</p>
        </PrivacySection>

        <PrivacySection title="Your Information Is Not Stored in a Visitor Account Database">
          <p>Robert’s Recipe Box does not require a central visitor-account database for supported personal Recipe Box features. Locally saved favorites, lists, plans, inventories, and preferences remain under the control of the visitor’s browser.</p>
          <p>This reduces the amount of personal visitor information the website needs to collect and maintain. It also means we cannot recover locally stored information for you if it is removed from your browser and you do not have a backup.</p>
        </PrivacySection>

        <PrivacySection title="Backup My Recipe Box">
          <p>The <strong>Backup My Recipe Box</strong> feature downloads a copy of supported Robert’s Recipe Box information saved in your browser. The JSON backup file is created in the browser and downloaded to your device; the website does not need to upload or retain that file on its server.</p>
          <p>Keep your backup somewhere you trust, such as your Documents folder, an external drive, a USB drive, iCloud Drive, Google Drive, Dropbox, or OneDrive. A backup contains only the information that existed when it was created, so create a newer backup periodically.</p>
          <button type="button" className="privacyInlineButton" onClick={openRecipeBoxData}>Go to Backup and Restore</button>
        </PrivacySection>

        <PrivacySection title="Restore My Recipe Box">
          <p>The <strong>Restore My Recipe Box</strong> feature lets you select a supported Robert’s Recipe Box backup and restore recognized information in a browser. This can help after browser data was cleared or when moving information to another browser or device.</p>
          <p>The selected file is read and processed in the browser for restoration. It is not intended to be uploaded and stored in a Robert’s Recipe Box visitor database. Restore only files you created yourself or received from a source you trust.</p>
        </PrivacySection>

        <PrivacySection title="When Browser Information Can Be Lost">
          <p>Locally saved information can be removed or become unavailable when browser data is cleared, private browsing is used, a browser is uninstalled, a device is reset or replaced, cleaning software removes website data, access to the device is lost, or storage fails.</p>
          <p>Browser-storage behavior varies by device, browser, privacy setting, and software version. Creating a Recipe Box backup is the best way to preserve supported personal information without creating an online account.</p>
        </PrivacySection>

        <PrivacySection title="Private Notes and Public Submissions Are Different">
          <p>Personal Recipe Box information stored in your browser is intended for your own use. Information you intentionally submit by email, a contact method, or a future public-submission feature is different and may need to be transmitted, reviewed, moderated, displayed, or stored.</p>
          <p>Do not include information in a public submission that you do not want others to read.</p>
        </PrivacySection>

        <PrivacySection title="Information You Choose to Send Us">
          <p>When you contact Robert’s Recipe Box, we may receive the information you choose to include, such as your name, email address, message, recipe suggestion, question, feedback, or technical details you provide while requesting support.</p>
          <p>Do not send passwords, payment information, Social Security numbers, medical records, or other highly sensitive personal information through ordinary website contact methods.</p>
        </PrivacySection>

        <PrivacySection title="Website Hosting and Normal Technical Information">
          <p>Like most websites, hosting and delivery services may process limited technical information needed to provide the site, maintain reliability, prevent abuse, or understand basic traffic. This can include an IP address, browser and device type, operating system, access time, requested files, referring page, and general performance or error information.</p>
          <p>Some of this processing may be performed automatically by the website host, domain provider, security provider, or other infrastructure service. Robert’s Recipe Box does not use this information to create required visitor accounts for ordinary recipe use.</p>
        </PrivacySection>

        <PrivacySection title="Outside Links, Services and Affiliate Links">
          <p>Robert’s Recipe Box may link to retailers, affiliate partners, videos, social media pages, or other outside services. Those services have their own privacy practices, security practices, account requirements, tracking technologies, cookies, and terms.</p>
          <p>Some links may be affiliate links. When a qualifying purchase is made, Robert’s Recipe Box may receive a commission at no additional cost to the visitor. Purchases are completed with the outside retailer, and the retailer or affiliate network may use its own referral codes or technologies.</p>
          <p>Robert’s Recipe Box does not receive your complete payment-card information merely because you use an affiliate link.</p>
        </PrivacySection>

        <PrivacySection title="Cookies and Similar Browser Technologies">
          <p>Robert’s Recipe Box uses browser storage for supported Recipe Box features and may use browser technologies needed for ordinary website operation. Outside services linked to or embedded in the site may use their own cookies or similar technologies.</p>
          <p>Browser storage used for Recipe Box features is different from technology used independently by an outside service. No cookie-consent banner is added by this page.</p>
        </PrivacySection>

        <PrivacySection title="Our Approach to Data Security">
          <p>Robert’s Recipe Box is designed to minimize the personal information it collects and stores. Keeping supported personal Recipe Box information in the visitor’s browser reduces the need for a central visitor-account database.</p>
          <p>However, no website, browser, computer, mobile device, downloaded file, storage provider, or internet connection can be guaranteed to be completely secure. Visitors should keep devices and browsers updated, protect access to their devices, and store backups in a location they trust.</p>
        </PrivacySection>

        <PrivacySection title="You Remain in Control">
          <p>You can browse and use the public recipe collection without creating a visitor account. You decide whether to use locally saved features, create a backup, and restore that backup on another device.</p>
          <p>You may remove website data through your browser settings, but doing so may permanently delete favorites, lists, plans, inventories, and preferences unless you created a backup first.</p>
        </PrivacySection>

        <section className="privacySummaryBox" aria-labelledby="privacy-summary-title">
          <h2 id="privacy-summary-title">A Simple Privacy Summary</h2>
          <ul>{SUMMARY_ITEMS.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <PrivacySection title="Questions About Privacy or Your Data">
          <address className="privacyContact">
            <strong>Robert’s Recipe Box</strong><br />
            Email: <a href="mailto:recipes@handsontech.cc">recipes@handsontech.cc</a><br />
            Website: Online Only
          </address>
        </PrivacySection>

        <footer className="privacyPageNotice">
          <strong>Last updated: July 23, 2026</strong>
          <p>This page describes the general privacy and browser-storage practices of Robert’s Recipe Box. It is intended to provide clear information to visitors and is not a guarantee that every browser, device, hosting provider, outside service, or internet connection will operate without risk.</p>
        </footer>
      </div>
    </main>
  );
}

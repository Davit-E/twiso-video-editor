import React from 'react';
import styles from './Webinar.module.css';
import pic1 from '../../../../assets/homepage/pic1.png';
import pic2 from '../../../../assets/homepage/pic2.png';
import pic3 from '../../../../assets/homepage/pic3.png';
import pic4 from '../../../../assets/homepage/pic4.png';
import pic5 from '../../../../assets/homepage/pic5.png';
import pic6 from '../../../../assets/homepage/pic6.png';

const Webinar = () => {
  return (
    <div className={styles.Webinar}>
      <h2 className={styles.Heading}>Webinar</h2>
      <p className={styles.Subheading}>
        Make your webinar branded and professional looking
      </p>
      <div className={styles.TemplatesList}>
        <div className={styles.Template}>
          <div
            className={styles.TemplateInner}
            style={{ backgroundImage: `url(${pic1})` }}
          ></div>
        </div>
        <div className={styles.Template}>
          <div
            className={styles.TemplateInner}
            style={{ backgroundImage: `url(${pic2})` }}
          ></div>
        </div>
        <div className={styles.Template}>
          <div
            className={styles.TemplateInner}
            style={{ backgroundImage: `url(${pic3})` }}
          ></div>
        </div>
        <div className={styles.Template}>
          <div
            className={styles.TemplateInner}
            style={{ backgroundImage: `url(${pic4})` }}
          ></div>
        </div>
        <div className={styles.Template}>
          <div
            className={styles.TemplateInner}
            style={{ backgroundImage: `url(${pic5})` }}
          ></div>
        </div>
        <div className={styles.Template}>
          <div
            className={styles.TemplateInner}
            style={{ backgroundImage: `url(${pic6})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Webinar;

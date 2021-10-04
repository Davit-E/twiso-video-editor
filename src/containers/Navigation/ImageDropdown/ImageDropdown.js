import React, { useContext, useRef, useEffect } from 'react';
import styles from './ImageDropdown.module.css';
import EditorContext from '../../../contexts/EditorContext';
import useUploadAsset from '../../../hooks/useUploadAsset';
import Spinner from '../../../components/Spinner2/Spinner';

const ImageDropdown = ({ assets, setAssets, setShouldFetch, isFirstMount }) => {
  const { editorDispatch } = useContext(EditorContext);
  const { isUploadingAsset, uploadAsset, uploadResponse } = useUploadAsset();
  const fileInput = useRef(null);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      setShouldFetch(true);
    }
  }, [setShouldFetch, isFirstMount]);

  useEffect(() => {
    if (uploadResponse && uploadResponse !== 'error') {
      setAssets((prevState) => [...prevState, uploadResponse.image]);
    }
  }, [uploadResponse, setAssets]);

  const clickHandler = (e) => {
    let imageType = 'customImage';
    let src = e.currentTarget.src;
    let splitSrc = src.split('.');
    if (splitSrc[splitSrc.length - 1] === 'svg') imageType = 'svg';
    editorDispatch({ type: 'setImageToAdd', data: { type: imageType, src } });
  };

  const inputChangeHandler = () => {
    if (fileInput.current.files[0]) {
      let file = fileInput.current.files[0];
      let formData = new FormData();
      formData.append('image', file);
      uploadAsset(formData);
    }
  };

  const uploadClickHandler = () => {
    fileInput.current.click();
  };

  const oddArr = assets ? assets.filter((_, i) => (i + 1) % 2 !== 0) : null;
  const evenArr = assets ? assets.filter((_, i) => (i + 1) % 2 === 0) : null;

  let assetsContent = assets ? (
    <div className={styles.Images}>
      <div className={styles.Column}>
        {oddArr.map((el, i) => {
          return (
            <div key={el._id} className={styles.ImageContainer}>
              <img
                className={styles.Image}
                src={el.image_url}
                alt='asset'
                onClick={clickHandler}
              />
            </div>
          );
        })}
      </div>
      <div className={styles.Column}>
        {evenArr.map((el, i) => {
          return (
            <div key={el._id} className={styles.ImageContainer}>
              <img
                className={styles.Image}
                src={el.image_url}
                alt='asset'
                onClick={clickHandler}
              />
            </div>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <div className={styles.Dropdown}>
      <div className={styles.UplaodButtonContainer}>
        <button onClick={uploadClickHandler} className={styles.UploadButton}>
          Upload image
        </button>
        <input
          accept='image/png, image/gif, image/jpeg, image/svg+xml'
          className={styles.FileInput}
          ref={fileInput}
          type='file'
          onChange={inputChangeHandler}
        />
        {isUploadingAsset ? (
          <Spinner
            style={{
              width: '25px',
              height: '25px',
              margin: '25px auto',
              position: 'absolute',
              right: '20px',
            }}
          />
        ) : null}
      </div>
      {!assets ? (
        <Spinner style={{ width: '50px', height: '50px' }} />
      ) : (
        assetsContent
      )}
    </div>
  );
};

export default ImageDropdown;

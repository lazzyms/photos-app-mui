import { useEffect, useCallback, useRef } from 'react';

// make API calls and pass the returned data via dispatch
export const useFetch = (data, dispatch, refresh) => {
  useEffect(() => {
    dispatch({ type: 'FETCHING_IMAGES', fetching: true })
    fetch(`${process.env.REACT_APP_API}?page=${data.page}&limit=10`)
      .then(async data => {
        let resposne = await data.json()
        return resposne.result.data
      })
      .then(images => {
        dispatch({ type: 'STACK_IMAGES', images })
        dispatch({ type: 'FETCHING_IMAGES', fetching: false })
      })
      .catch(e => {
        // handle error
        dispatch({ type: 'FETCHING_IMAGES', fetching: false })
        return e;
      })
  }, [dispatch, data.page, refresh])
}

// infinite scrolling with intersection observer
export const useInfiniteScroll = (scrollRef, dispatch) => {
  const scrollObserver = useCallback(
    node => {
      new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.intersectionRatio > 0) {
            dispatch({ type: 'ADVANCE_PAGE' });
          }
        });
      }).observe(node);
    },
    [dispatch]
  );

  useEffect(() => {
    console.log(scrollRef)
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef]);
}

// lazy load images with intersection observer
export const useLazyLoading = (imgSelector, items) => {

  const imgObserver = useCallback(node => {
    const intObs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.intersectionRatio > 0) {
          const currentImg = en.target;
          const newImgSrc = currentImg.style.backgroundImage;

          // only swap out the image source if the new url exists
          if (!newImgSrc) {
            console.error('Image source is invalid', newImgSrc);
          } else {
            currentImg.style.backgroundImage = newImgSrc;
          }
          intObs.unobserve(node);
        }
      });
    })
    intObs.observe(node);
  }, []);

  const imagesRef = useRef(null);

  useEffect(() => {
    imagesRef.current = document.querySelectorAll(imgSelector);

    if (imagesRef.current) {
      imagesRef.current.forEach(img => imgObserver(img));
    }
  }, [imgObserver, imagesRef, imgSelector, items])
}
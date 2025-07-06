import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import fonLast from '../assets/fon-last-page.png';
import favoriteIcon from '../assets/favorite.png';
import favoriteIconFilled from '../assets/favorite-filled.png';
import arrowIcon from '../assets/vector.png';
import '../styles/Results.css';

export default function Results() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem('wishlist') || '[]')
  );
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  function fetchProducts(pageNum) {
    axios
      .get(`https://jeval.com.au/collections/hair-care/products.json?page=${pageNum}`)
      .then(res => {
        const fetched = res.data.products || [];
        if (fetched.length === 0) {
          setHasMore(false);
          return;
        }

        const keywords = Object.values(userAnswers)
          .flat()
          .map(word => word.toLowerCase());

        const filtered = fetched.filter(p => {
          const text = `${p.title} ${p.body_html} ${p.tags?.join(' ')}`.toLowerCase();
          return keywords.some(word => text.includes(word));
        });

        const combined = [...products, ...filtered];
        const unique = [...new Map(combined.map(p => [p.id, p])).values()];
        const sorted = [
          ...wishlist,
          ...unique.filter(p => !wishlist.some(w => w.id === p.id))
        ];

        setProducts(sorted);
      });
  }

  function toggleWishlist(product) {
    const updated = wishlist.some(p => p.id === product.id)
      ? wishlist.filter(p => p.id !== product.id)
      : [...wishlist, product];

    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  }

  function scrollToSlide(index) {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      const newScrollLeft = index * slideWidth;

      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setActiveIndex(index);
    }
  }

  function scrollRight() {
    scrollToSlide(activeIndex + 1);
    const totalSlides = Math.ceil(products.length / 2);
    if (activeIndex + 1 >= totalSlides - 1 && hasMore) {
      setPage(prev => prev + 1);
    }
  }

  function scrollLeft() {
    if (activeIndex > 0) {
      scrollToSlide(activeIndex - 1);
    }
  }

  const totalSlides = Math.ceil(products.length / 2);

  return (
    <>
      <div className="results-top-section" style={{ backgroundImage: `url(${fonLast})` }}>
        <div className="results-overlay">
          <div className="results-content">
            <h1 className="results-title">Build your everyday self care routine.</h1>
            <p className="results-description">
              Perfect for if you're looking for soft, nourished skin, our moisturizing body washes
              are made with skin-natural nutrients that work with your skin to replenish moisture.
              With a light formula, the bubbly lather leaves your skin feeling cleansed and cared for.
              And by choosing relaxing fragrances you can add a moment of calm to the end of your day.
            </p>
            <button className="retake-button" onClick={() => navigate('/')}>
              Retake the quiz
            </button>
          </div>
        </div>
      </div>

      <div className="results-float-block">
        <div className="cards-floating-container">
          <div className="results-carousel-wrapper">
            <div className="product-card routine-card">
              <div className="routine-card-inner">
                <h3>Daily routine</h3>
                <p>
                  Perfect for if you're looking for soft, nourished skin, our moisturizing body washes are
                  made with skin-natural nutrients that work with your skin to replenish moisture. With a
                  light formula, the bubbly lather leaves your skin feeling cleansed and cared for. And by
                  choosing relaxing fragrances you can add a moment of calm to the end of your day.
                </p>
              </div>
            </div>

            <div className="carousel-outer">
              <div className="carousel-container">
                <div className="results-carousel" ref={carouselRef}>
                  {Array.from({ length: totalSlides }, (_, index) => {
                    const slice = products.slice(index * 2, index * 2 + 2);
                    return (
                      <div className="carousel-slide" key={index}>
                        {slice.map(product => (
                          <div key={product.id} className="product-card">
                            <div className="product-image-wrapper">
                              <button
                                className="wishlist-btn"
                                onClick={() => toggleWishlist(product)}
                              >
                                <img
                                  src={
                                    wishlist.some(p => p.id === product.id)
                                      ? favoriteIconFilled
                                      : favoriteIcon
                                  }
                                  alt="Wishlist"
                                />
                              </button>
                              <img
                                className="product-image"
                                src={product.images[0]?.src}
                                alt={product.title}
                              />
                            </div>
                            <div className="product-info">
                              <h4>{product.title}</h4>
                              <p>${product.variants[0].price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {activeIndex > 0 && (
                <button className="carousel-prev" onClick={scrollLeft}>
                  <img src={arrowIcon} alt="Prev" style={{ transform: 'rotate(180deg)' }} />
                </button>
              )}

              {hasMore && activeIndex < totalSlides - 1 && (
                <button className="carousel-next" onClick={scrollRight}>
                  <img src={arrowIcon} alt="Next" />
                </button>
              )}

              <div className="pagination-dots">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <span
                    key={i}
                    className={i === activeIndex ? 'dot active' : 'dot'}
                    onClick={() => scrollToSlide(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

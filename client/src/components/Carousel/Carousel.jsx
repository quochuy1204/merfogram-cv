import React from 'react';
import './carousel.css'

function Carousel({ images, id }) {
    const isActive = (index) => {
        if (index === 0) {
            return "active"
        }
    }

    return (
        <div className="images-slide">
            <div id={`post${id}`} className="carousel slide" data-bs-ride="">
                <div className="carousel-indicators">
                    {
                        images.length > 1 &&
                        <>
                            {
                                images.map((image, index) => (
                                    <button style={{ borderRadius: '50%', width: '7px', height: '7px' }} disabled key={index} type="button" data-bs-target={`#post${id}`} data-bs-slide-to={index} className={`${isActive(index)}`}></button>
                                ))
                            }
                        </>

                    }

                </div>

                <div className="carousel-inner">
                    {
                        images.map((image, index) => (
                            <div key={index} className={`carousel-item ${isActive(index)}`}>
                                <img src={image.url} className="d-block" alt={image.url} />
                            </div>
                        ))
                    }
                </div>
                {
                    images.length > 1 &&
                    <>
                        <button className="carousel-control-prev" type="button" data-bs-target={`#post${id}`} data-bs-slide="prev">
                            <span className="material-icons back" aria-hidden="true">
                                navigate_before
                            </span>
                            <span className="visually-hidden">Previous</span>
                        </button>

                        <button className="carousel-control-next" type="button" data-bs-target={`#post${id}`} data-bs-slide="next">
                            <span className="material-icons next" aria-hidden="true">
                                navigate_next
                            </span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </>

                }
            </div>
        </div>

    );
}

export default Carousel;
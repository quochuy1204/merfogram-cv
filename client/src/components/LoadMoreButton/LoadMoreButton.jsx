import React from 'react';

function LoadMoreButton({ result, page, handleLoadMore, load }) {
    return (
        <div>
            {
                result < 3 * (page - 1)
                    ? ''
                    : !load && <button style={{ color: '#262626', fontSize: '24px', fontWeight: '500', boxShadow: '1px 1px 3px 1px #DDDDDD', border: '0px solid transparent' }} className="d-block mx-auto my-4" onClick={handleLoadMore}>+</button>
            }
        </div >
    );
}

export default LoadMoreButton;
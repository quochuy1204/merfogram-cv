import React from 'react';
import './footer.css'

import moment from 'moment'

function Footer(props) {
    return (
        <div className='footer'>
            <span className='span-footer'>&copy; {moment().format('YYYY')} Merfogram from Huyanh</span>
        </div>
    );
}

export default Footer;
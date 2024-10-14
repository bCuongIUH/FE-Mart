// Barcode.js
import React, { useEffect, useRef } from 'react';
import bwipjs from 'bwip-js';

const Barcode = ({ code }) => {
    const canvasRef = useRef(null); // Tạo tham chiếu cho canvas

    useEffect(() => {
        try {
            // Sử dụng bwip-js để tạo mã vạch
            bwipjs.toCanvas(canvasRef.current, {
                bcid: 'code128', 
                text: code, 
                scale: 3, 
                height: 10, 
                includetext: true, 
                textxalign: 'center',
                
            });
        } catch (e) {
            console.error(e); 
        }
    }, [code]);

    return <canvas ref={canvasRef}></canvas>; 
};

export default Barcode;

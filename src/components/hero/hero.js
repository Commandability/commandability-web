import * as React from "react";
import styled from "styled-components";

import { COLORS } from "constants.js";

function Hero({ children }) {
  return (
    <Picture>
      <source
        type="image/webp"
        media="(max-width: 767px)"
        sizes="(max-width: 1534px) 100vw, 1534px"
        srcSet={`
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_1_1,c_fill,g_auto__c_scale,w_480.webp 480w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_1_1,c_fill,g_auto__c_scale,w_903.webp 903w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_1_1,c_fill,g_auto__c_scale,w_1207.webp 1207w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_1_1,c_fill,g_auto__c_scale,w_1467.webp 1467w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_1_1,c_fill,g_auto__c_scale,w_1534.webp 1534w`}
      />
      <source
        type="image/webp"
        media="(min-width: 768px) and (max-width: 991px)"
        sizes="(max-width: 1982px) 100vw, 1982px"
        srcSet={`
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_4_3,c_fill,g_auto__c_scale,w_768.webp 768w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_4_3,c_fill,g_auto__c_scale,w_1121.webp 1121w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_4_3,c_fill,g_auto__c_scale,w_1512.webp 1512w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_4_3,c_fill,g_auto__c_scale,w_1972.webp 1972w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_4_3,c_fill,g_auto__c_scale,w_1982.webp 1982w`}
      />
      <source
        type="image/webp"
        media="(min-width: 992px) and (max-width: 1199px)"
        sizes="(max-width: 2398px) 100vw, 2398px"
        srcSet={`
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_16_9,c_fill,g_auto__c_scale,w_992.webp 992w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_16_9,c_fill,g_auto__c_scale,w_1470.webp 1470w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_16_9,c_fill,g_auto__c_scale,w_1969.webp 1969w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_16_9,c_fill,g_auto__c_scale,w_2342.webp 2342w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_16_9,c_fill,g_auto__c_scale,w_2400.webp 2400w`}
      />
      <source
        type="image/webp"
        media="(min-width: 1200px)"
        sizes="(max-width: 3000px) 100vw, 3000px"
        srcSet={`
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_16_9,c_fill,g_auto__c_scale,w_1200.webp 1200w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_16_9,c_fill,g_auto__c_scale,w_1971.webp 1971w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_16_9,c_fill,g_auto__c_scale,w_2590.webp 2590w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_16_9,c_fill,g_auto__c_scale,w_3236.webp 3236w,
        ${process.env.PUBLIC_URL}/images/hero/hero_ub8rir_ar_16_9,c_fill,g_auto__c_scale,w_3840.webp 3840w`}
      />
      <Img
        src={`${process.env.PUBLIC_URL}/images/hero/hero_dklzjh_ar_16_9,c_fill,g_auto__c_scale,w_1200.jpg`}
        alt=""
      />
      <Gradient />
      <Content>{children}</Content>
    </Picture>
  );
}

const Picture = styled.picture`
  height: 100%;
  position: relative;
  background-color: var(--color-gray-1);
`;

const Img = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: left;
  filter: saturate(40%);
`;

const Gradient = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background: linear-gradient(
    270deg,
    hsl(${COLORS.red[5]} / 0.5) 10%,
    hsl(${COLORS.red[5]} / 0.4) 20%,
    hsl(${COLORS.red[5]} / 0.2) 30%,
    hsl(${COLORS.red[1]} / 0.1) 60%,
    hsl(0 0% 0% / 0.45) 75%
  );
`;

const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default Hero;

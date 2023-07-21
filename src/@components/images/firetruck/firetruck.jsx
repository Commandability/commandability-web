import * as React from "react";
import styled from "styled-components";

import webp400 from "@assets/images/footer_gaugzs_ar_1_1,c_fill,g_auto__c_scale,w_400.webp";
import webp1127 from "@assets/images/footer_gaugzs_ar_1_1,c_fill,g_auto__c_scale,w_1127.webp";
import webp768 from "@assets/images/footer_gaugzs_ar_4_3,c_fill,g_auto__c_scale,w_768.webp";
import webp1502 from "@assets/images/footer_gaugzs_ar_4_3,c_fill,g_auto__c_scale,w_1502.webp";
import webp992 from "@assets/images/footer_gaugzs_ar_16_9,c_fill,g_auto__c_scale,w_992.webp";
import webp2003 from "@assets/images/footer_gaugzs_ar_16_9,c_fill,g_auto__c_scale,w_2003.webp";
import webp1200 from "@assets/images/footer_gaugzs_c_scale,w_1200.webp";
import webp2449 from "@assets/images/footer_gaugzs_c_scale,w_2449.webp";
import webp2917 from "@assets/images/footer_gaugzs_c_scale,w_2917.webp";
import jpg1920 from "@assets/images/footer_apkfbg_c_scale,w_1920.jpg";
import { COLORS, QUERIES } from "@constants";

function Firetruck({ children }) {
  return (
    <>
      <Picture>
        {/* Images generated with https://responsivebreakpoints.com/ */}
        <source
          type="image/webp"
          media="(max-width: 767px)"
          sizes="(max-width: 1127px) 100vw, 1127px"
          srcSet={`
          ${webp400} 400w,
          ${webp1127} 1127w`}
        />
        <source
          type="image/webp"
          media="(min-width: 768px) and (max-width: 991px)"
          sizes="(max-width: 1502px) 100vw, 1502px"
          srcSet={`
          ${webp768} 768w,
          ${webp1502} 1502w`}
        />
        <source
          type="image/webp"
          media="(min-width: 992px) and (max-width: 1199px)"
          sizes="(max-width: 2003px) 100vw, 2003px"
          srcSet={`
          ${webp992} 992w,
          ${webp2003} 2003w`}
        />
        <source
          type="image/webp"
          media="(min-width: 1200px)"
          sizes="(max-width: 2917px) 100vw, 2917px"
          srcSet={`
          ${webp1200} 1200w,
          ${webp2449} 2449w,
          ${webp2917} 2917w`}
        />
        <Img src={`${jpg1920}`} loading="lazy" alt="" />
        <Gradient />
        <Content>{children}</Content>
      </Picture>
    </>
  );
}

const Picture = styled.picture`
  position: relative;
  background-color: var(--color-gray-1);
`;

const Img = styled.img`
  width: 100vw;
  height: clamp(600px, 80vh, 900px);
  max-height: 100vh;
  object-fit: cover;
  filter: saturate(50%);
`;

const Gradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    hsl(${COLORS.red[5]} / 0.24) 0%,
    hsl(${COLORS.red[5]} / 0.12) 36%,
    hsl(0 0% 0% / 0.96) 88%
  );
  @media ${QUERIES.phoneAndSmaller} {
    background: linear-gradient(
      90deg,
      hsl(${COLORS.red[5]} / 0.24) 0%,
      hsl(${COLORS.red[5]} / 0.12) 36%,
      hsl(0 0% 0% / 0.96) 88%
    );
  }
`;

const Content = styled.div`
  position: absolute;
  inset: 0;
`;

export default Firetruck;

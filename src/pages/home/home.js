import * as React from "react";
import styled from "styled-components";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "firebase.js";

import { useAuth } from "context/auth-context";

function Home() {
  const [user] = useAuth();

  return (
    <Wrapper>
      <Picture>
        {/* Images generated with https://responsivebreakpoints.com/ */}
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
        <img
          src={`${process.env.PUBLIC_URL}/images/hero/hero_dklzjh_ar_4_3,c_fill,g_auto__c_scale,w_1982.jpg`}
          alt=""
        />
      </Picture>
      <div>Home</div>
      {user.current ? (
        <button onClick={() => signOut(auth)}>Sign out</button>
      ) : (
        <button onClick={() => signInWithEmailAndPassword(auth, "", "")}>
          Sign in
        </button>
      )}
    </Wrapper>
  );
}

const Picture = styled.picture`
  height: 100%;

  & > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: left;
  }
`;

const Wrapper = styled.div`
  height: 100%;
`;

export default Home;

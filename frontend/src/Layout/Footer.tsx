import React from 'react';
import styled from 'styled-components';

const FooterLayout = styled.div`
  font-size: 1.6rem;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Footer = () => {
  return (
    <FooterLayout>
      <div>상호명 : 주식회사 워크원오원</div>
      <div>사업자등록번호 : 240-81-02944 | 대표 : 채동식</div>
      <div>주소 : 인천광역시 서구 심곡로100번길 7, 의생명융합관 2층</div>
      <div>H.P : 032-568-1016 | FAX : 032-568-1018</div>
    </FooterLayout>
  );
};

export default Footer;

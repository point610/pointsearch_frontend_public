import React from "react";
import {PageContainer} from "@ant-design/pro-components";
import SettingInfo from "@/pages/User/Center/components/SettingInfo";
import UpdatePassword from "@/pages/User/Center/components/UpdatePassword";
import ASKInfo from "@/pages/User/Center/components/ASKInfo";
import SDKInfo from "@/pages/User/Center/components/SDKInfo";

const SettingPage: React.FC = () => {
  return (
    <PageContainer>
      <SettingInfo></SettingInfo>
      <p/>
      <UpdatePassword></UpdatePassword>
      <p/>
      <ASKInfo></ASKInfo>
      <p/>
      <SDKInfo></SDKInfo>
    </PageContainer>
  )
    ;
};
export default SettingPage;

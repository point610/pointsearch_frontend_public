import AllSearchModal from '@/pages/Search/components/AllSearchModal';
import PictureSearchModal from '@/pages/Search/components/PictureSearchModal';
import PostSearchModal from '@/pages/Search/components/PostSearchModal';
import UserSearchModal from '@/pages/Search/components/UserSearchModal';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Tabs, TabsProps } from 'antd';
import Search from 'antd/es/input/Search';
import React, { useReducer, useState } from 'react';

const Welcome: React.FC = () => {
  const [searchContent, setSearchContent] = useState('');
  const [canSearch, setCanSearch] = useState(false);
  const [allSearch, setAllSearch] = useState(true);
  const [postSearch, setPostSearch] = useState(false);
  const [pictureSearch, setPictureSearch] = useState(false);
  const [userSearch, setUserSearch] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const onSearch = () => {
    setCanSearch(false);
    setCanSearch(true);
  };

  const onChange = (key: string) => {
    setAllSearch(false);
    setPostSearch(false);
    setPictureSearch(false);
    setUserSearch(false);
    switch (key) {
      case 'all': {
        setAllSearch(true);
        console.log(key);
        break;
      }
      case 'post': {
        setPostSearch(true);
        console.log(key);
        break;
      }
      case 'picture': {
        setPictureSearch(true);
        console.log(key);
        break;
      }
      case 'user': {
        setUserSearch(true);
        console.log(key);
        break;
      }
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCanSearch(false);
    setSearchContent(e.target.value);
  };
  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: `综合`,
      children: (
        <div>
          {allSearch && canSearch && <AllSearchModal values={searchContent}></AllSearchModal>}
        </div>
      ),
    },
    {
      key: 'post',
      label: `文章`,
      children: (
        <div>
          {postSearch && canSearch && <PostSearchModal values={searchContent}></PostSearchModal>}
        </div>
      ),
    },
    {
      key: 'user',
      label: `用户`,
      children: (
        <div>
          {userSearch && canSearch && <UserSearchModal values={searchContent}></UserSearchModal>}
        </div>
      ),
    },
    {
      key: 'picture',
      label: `图片`,
      children: (
        <div>
          {pictureSearch && canSearch && (
            <PictureSearchModal values={searchContent}></PictureSearchModal>
          )}
        </div>
      ),
    },
  ];
  return (
    <PageContainer>
      <Search
        allowClear
        onChange={handleSearchChange}
        enterButton="搜索"
        size="large"
        onSearch={onSearch}
      />
      <p></p>
      <Card>
        <Tabs defaultActiveKey="all" items={items} onChange={onChange} size={'large'} />
      </Card>
    </PageContainer>
  );
};
export default Welcome;

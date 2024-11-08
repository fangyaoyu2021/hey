import type { NextPage } from 'next';

import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import isFeatureAvailable from '@helpers/isFeatureAvailable';
import { Leafwatch } from '@helpers/leafwatch';
import { HomeFeedType } from '@hey/data/enums';
import { FeatureFlag } from '@hey/data/feature-flags';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useEffect, useState } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import FeedType from './FeedType';
import ForYou from './ForYou';
import Hero from './Hero';
import PaidActions from './PaidActions';
import Sidebar from './Sidebar';
import Timeline from './Timeline';

const Home: NextPage = () => {
  const forYouEnabled =
    isFeatureAvailable(FeatureFlag.Gardener) ||
    isFeatureAvailable(FeatureFlag.LensTeam);

  const { currentProfile } = useProfileStore();
  const [feedType, setFeedType] = useState<HomeFeedType>(
    forYouEnabled ? HomeFeedType.FORYOU : HomeFeedType.FOLLOWING
  );

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'home' });
  }, []);

  const loggedInWithProfile = Boolean(currentProfile);

  return (
    <>
      {!loggedInWithProfile && <Hero />}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {loggedInWithProfile ? (
            <>
              <NewPost />
              <FeedType feedType={feedType} setFeedType={setFeedType} />
              {feedType === HomeFeedType.FOLLOWING ? (
                <Timeline />
              ) : feedType === HomeFeedType.FORYOU ? (
                <ForYou />
              ) : feedType === HomeFeedType.PREMIUM ? (
                <PaidActions />
              ) : null}
            </>
          ) : (
            <ExploreFeed />
          )}
        </GridItemEight>
        <GridItemFour>
          <Sidebar />
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default Home;

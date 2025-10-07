import { getTranslate } from '@/i18n/server';
import { Link } from '@/i18n/routing';
import NotFoundRenderBlock from '@/components/blocks/pages/not-found/render';

const NotFoundTemplate = async () => {
  const { translate } = await getTranslate();
  return <NotFoundRenderBlock />;
};

export { NotFoundTemplate };

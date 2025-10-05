import { getTranslate } from '@/i18n/server';
import { Link } from '@/i18n/routing';

const NotFoundTemplate = async () => {
  const { translate } = await getTranslate();
  return (
    <div>
      <div>404</div>
    </div>
  );
};

export { NotFoundTemplate };

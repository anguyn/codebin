import { getTranslate } from '@/i18n/server';
import { Link } from '@/i18n/routing';

const NotFoundTemplate = async () => {
  const { translate } = await getTranslate();
  return (
    <div>
      <div>404</div>
      <div>
        {await translate({
          vi: 'Ohje, diese Seite wurde nicht gefunden!',
          en: 'Oh dear, this page was not found!',
        })}
      </div>
      <p>
        {await translate({
          vi: 'Die gesuchte Seite konnte nicht gefunden werden. Sie wurde möglicherweise entfernt, umbenannt oder existierte von vornherein nicht.',
          en: 'The page you were looking for could not be found. It may have been removed, renamed, or did not exist in the first place.',
        })}
      </p>
      <div>
        <Link href="/">
          {await translate({
            vi: 'Zur Startseite eeee',
            en: 'Back to the home page',
          })}
        </Link>
      </div>
    </div>
  );
};

export { NotFoundTemplate };

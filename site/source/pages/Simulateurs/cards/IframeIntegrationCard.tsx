import { Trans, useTranslation } from 'react-i18next'

import Emoji from '@/components/utils/Emoji'
import { Article } from '@/design-system/card'

type IframeIntegrationCardProps = {
	sitePaths: { développeur: { iframe: string } }
	iframePath: string
}

export function IframeIntegrationCard({
	sitePaths,
	iframePath,
}: IframeIntegrationCardProps) {
	const { t } = useTranslation()

	return (
		<Article
			icon={<Emoji emoji="👩‍🔧" />}
			title={
				<Trans i18nKey="nextSteps.integration-iframe.title">
					Intégrer le module web
				</Trans>
			}
			ctaLabel={t('nextSteps.integration-iframe.cta', 'Voir la documentation')}
			to={{
				pathname: sitePaths.développeur.iframe,
				search: `?module=${iframePath}`,
			}}
		>
			<Trans i18nKey="nextSteps.integration-iframe.body">
				Decouvrez comment ajouter ce simulateur sur votre site internet en un
				clic via un script clé en main.
			</Trans>
		</Article>
	)
}

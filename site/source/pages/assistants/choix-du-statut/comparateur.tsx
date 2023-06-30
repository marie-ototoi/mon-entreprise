import { useMemo } from 'react'
import { Trans } from 'react-i18next'

import { EngineDocumentationRoutes } from '@/components/EngineDocumentationRoutes'
import { StatutType } from '@/components/StatutTag'
import { useEngine, useRawSituation } from '@/components/utils/EngineContext'
import { Button } from '@/design-system/buttons'
import { Container } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { Intro } from '@/design-system/typography/paragraphs'
import { EngineComparison } from '@/pages/simulateurs/comparaison-statuts/components/Comparateur'
import Détails from '@/pages/simulateurs/comparaison-statuts/components/Détails'
import ModifierOptions from '@/pages/simulateurs/comparaison-statuts/components/ModifierOptions'
import RevenuEstimé from '@/pages/simulateurs/comparaison-statuts/components/RevenuEstimé'
import StatutChoice from '@/pages/simulateurs/comparaison-statuts/components/StatutChoice'
import { useCasParticuliers } from '@/pages/simulateurs/comparaison-statuts/contexts/CasParticuliers'
import { useSitePaths } from '@/sitePaths'
import { Situation } from '@/store/reducers/rootReducer'

import { usePreviousStep } from './_components/useSteps'

export default function Comparateur() {
	const namedEngines = useStatutComparaison()
	const { absoluteSitePaths } = useSitePaths()
	const previousStep = usePreviousStep()
	const choixDuStatutPath = absoluteSitePaths.assistants['choix-du-statut']

	return (
		<>
			<Trans i18nKey="choix-statut.commune.description">
				<Intro>
					Vous allez maintenant pouvoir entrer dans le détail et comparer{' '}
					<Strong>les revenus</Strong>, la <Strong>couverture sociale</Strong>{' '}
					et la <Strong>gestion comptable et juridique</Strong> avant de faire
					votre choix.
				</Intro>
			</Trans>

			<Container
				backgroundColor={(theme) =>
					theme.darkMode
						? theme.colors.extended.dark[700]
						: theme.colors.bases.primary[100]
				}
				css={`
					padding: 2rem 0;
				`}
			>
				<RevenuEstimé />
				<StatutChoice namedEngines={namedEngines} />
				<div
					css={`
						display: flex;
						justify-content: space-between;
						padding-top: 2rem;
					`}
				>
					<Button
						light
						color={'secondary'}
						to={choixDuStatutPath[previousStep]}
					>
						{' '}
						<span aria-hidden>←</span> <Trans>Précédent</Trans>
					</Button>
					<ModifierOptions namedEngines={namedEngines} />
				</div>
			</Container>
			<Détails namedEngines={namedEngines} />
			<EngineDocumentationRoutes
				namedEngines={namedEngines}
				basePath={absoluteSitePaths.assistants['choix-du-statut'].comparateur}
			/>
		</>
	)
}

/**
 * Returns the situation for computing the results with the given statut
 * @param statut
 */
function useStatutComparaison(): EngineComparison {
	const { isAutoEntrepreneurACREEnabled } = useCasParticuliers()
	const possibleStatuts = usePossibleStatuts()
	const situation = useRawSituation()
	const engine = useEngine()

	return useMemo(
		() =>
			possibleStatuts.map((statut) => ({
				name: statut,
				engine: engine.shallowCopy().setSituation({
					...situation,
					...getSituationFromStatut(statut, isAutoEntrepreneurACREEnabled),
				}),
			})) as EngineComparison,
		[possibleStatuts, isAutoEntrepreneurACREEnabled]
	)
}

const SASUEIAE: StatutType[] = ['SASU', 'EI', 'AE']
const SASUEURL: StatutType[] = ['SASU', 'EURL']
const SASSARL: StatutType[] = ['SAS', 'SARL']
function usePossibleStatuts(): Array<StatutType> {
	const engine = useEngine()
	// We could do this logic by filtering the applicable status in publicodes,
	// but for now, there is only two options, so we hardcode it
	if (
		engine.evaluate('entreprise . catégorie juridique . EI = non').nodeValue !==
		true
	) {
		return SASUEIAE
	} else if (
		engine.evaluate('entreprise . catégorie juridique . SARL . EURL = non')
			.nodeValue !== true
	) {
		return SASUEURL
	} else {
		return SASSARL
	}
}

function getSituationFromStatut(
	statut: StatutType,
	AEAcre: boolean
): Situation {
	return {
		'entreprise . catégorie juridique . remplacements': 'oui',
		'entreprise . catégorie juridique':
			statut === 'SASU'
				? "'SAS'"
				: statut === 'EURL'
				? "'EURL'"
				: statut === 'AE'
				? "'EI'"
				: statut === 'SELARLU'
				? "'SELARL'"
				: statut === 'SELASU'
				? "'SELAS'"
				: `'${statut}'`,
		'entreprise . catégorie juridique . EI . auto-entrepreneur':
			statut === 'AE' ? 'oui' : 'non',
		'entreprise . associés': ['SARL', 'SAS', 'SELAS', 'SELARL'].includes(statut)
			? "'multiple'"
			: "'unique'",
		...(statut === 'AE'
			? { 'dirigeant . exonérations . ACRE': AEAcre ? 'oui' : 'non' }
			: {}),
	}
}

import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Appear } from '@/components/ui/animate'
import { Button, HelpButtonWithPopover } from '@/design-system/buttons'
import { ChevronIcon } from '@/design-system/icons'
import InfoBulle from '@/design-system/InfoBulle'
import { Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H4, H5 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'

import GuichetInfo from './GuichetInfo'

interface ResultProps {
	debug: string | null
	item: {
		title: string
		codeApe: string
		contenuCentral: string[]
		contenuAnnexe: string[]
		contenuExclu: string[]
	}
	hideGuichetUnique: boolean
}

export const Result = ({ item, debug, hideGuichetUnique }: ResultProps) => {
	const { title, codeApe, contenuCentral, contenuAnnexe, contenuExclu } = item
	const [open, setOpen] = useState(false)
	const { t } = useTranslation()

	return (
		<>
			<H4 as="h3">
				{title}
				{debug && (
					<InfoBulle>
						<pre>{debug}</pre>
					</InfoBulle>
				)}
			</H4>
			<Body
				css={`
					display: flex;
					justify-content: space-between;
					align-items: center;
				`}
			>
				<Strong>Code : {codeApe}</Strong>
				<Button
					size="XXS"
					light
					color="secondary"
					onPress={() => setOpen((x) => !x)}
					aria-expanded={open}
					aria-controls={`info-${codeApe}`}
					aria-label={!open ? t('En savoir plus') : t('Replier')}
				>
					{!open ? t('En savoir plus') : t('Replier')}&nbsp;
					<StyledChevron aria-hidden $isOpen={open} />
				</Button>
			</Body>
			{open && (
				<Appear id={`info-${codeApe}`}>
					{contenuCentral.length ? (
						<>
							<H5 as="h4">Contenu central de cette activité :</H5>
							<Ul>
								{contenuCentral.map((contenu, i) => (
									<Li key={i}>{contenu}</Li>
								))}
							</Ul>
						</>
					) : null}

					{contenuAnnexe.length ? (
						<>
							<H5 as="h4">Contenu annexe de cette activité :</H5>
							<Ul>
								{contenuAnnexe.map((contenu, i) => (
									<Li key={i}>{contenu}</Li>
								))}
							</Ul>
						</>
					) : null}

					{contenuExclu.length ? (
						<>
							<H5 as="h4">Contenu exclu de cette activité :</H5>
							<Ul>
								{contenuExclu.map((contenu, i) => (
									<Li key={i}>{contenu}</Li>
								))}
							</Ul>
						</>
					) : null}
					{!hideGuichetUnique && (
						<>
							<Trans i18nKey={'codeApe.catégorie-guichet'}>
								<H4>
									Catégories du Guichet unique
									<HelpButtonWithPopover
										type="info"
										title="Qu'est-ce que le guichet unique ?"
									>
										<Body>
											Le{' '}
											<Link href="https://procedures.inpi.fr/">
												Guichet électronique des formalités d’entreprises
											</Link>{' '}
											(Guichet unique) est un portail internet sécurisé, auprès
											duquel toute entreprise est tenue de déclarer sa création,
											depuis le 1er janvier 2023.
										</Body>
										<Body>
											Il utilise une classification des activités différente de
											celle utilisée par l'INSEE pour code APE.
										</Body>
									</HelpButtonWithPopover>
								</H4>
							</Trans>
							<GuichetInfo apeCode={codeApe} />
						</>
					)}
				</Appear>
			)}
		</>
	)
}

const StyledGrid = styled(Grid)`
	display: flex;
	justify-content: end;
	align-items: center;
`

const StyledChevron = styled(ChevronIcon)<{ $isOpen: boolean }>`
	vertical-align: middle;
	transform: rotate(-90deg);
	transition: transform 0.3s;
	${({ $isOpen }) =>
		!$isOpen &&
		css`
			transform: rotate(90deg);
		`}
`

<script setup>
import heroProfileImage from '../assets/images/Persona/iFest_parlant_de_cara_wide.jpeg'
import cvFile from '../assets/Jan Moran.pdf'
</script>

<template>
	<section class="hero" id="home" aria-labelledby="hero-title">
		<div class="hero__content">
			<p class="hero__eyebrow">Building things since 2003</p>
			<h1 id="hero-title">Jan Moran Ricardo</h1>

			<p class="hero__roles">Telecom Engineering | CS | Entrepreneur</p>

			<p class="hero__bio">
				Two engineering degrees, one startup in progress and three years of experience in the space sector and entrepreneurship.  
                
                I define myself as a person who likes to do and create things.    

            </p>

			<div class="hero__actions">
				<a class="btn btn--primary" :href="cvFile" download="Jan Moran.pdf" aria-label="Download CV">Download CV</a>
				<a class="btn btn--outline" href="#contact" aria-label="Go to contact section">Contact Me</a>
			</div>
		</div>

		<div class="hero__visual" aria-hidden="true">
			<div class="hero__shape"></div>
			<img class="hero__image" :src="heroProfileImage" alt="" />
		</div>
	</section>
</template>

<style scoped>
.hero {
	min-height: min(88svh, 860px);
	display: grid;
	grid-template-columns: 1.05fr 0.95fr;
	gap: 2.4rem;
	align-items: center;
	padding: clamp(2.2rem, 4vw, 4.5rem);
}

.hero__content {
	max-width: 80ch;
}

.hero__eyebrow {
	margin: 0 0 0.9rem;
	text-transform: uppercase;
	letter-spacing: 0.12em;
	font-size: 0.74rem;
	color: var(--action-green);
	font-family: var(--font-mono);
}

h1 {
	margin: 0;
	font-family: var(--font-serif);
	font-size: clamp(2rem, 3.7vw, 4.8rem);
	line-height: 0.95;
	letter-spacing: -0.03em;
	color: var(--text-main);
}

.hero__roles {
	margin: 1.15rem 0 0;
	font-size: clamp(0.95rem, 1.7vw, 1.15rem);
	color: var(--action-green-soft);
	letter-spacing: 0.03em;
	font-family: var(--font-mono);
}

.hero__bio {
	margin: 1.25rem 0 0;
	color: var(--text-main);
	opacity: 0.86;
	font-size: clamp(1rem, 1.35vw, 1.16rem);
	line-height: 1.72;
}

.hero__actions {
	margin-top: 2rem;
	display: flex;
	flex-wrap: wrap;
	gap: 0.88rem;
}

.btn {
	text-decoration: none;
	font-weight: 600;
	border-radius: 999px;
	padding: 0.8rem 1.35rem;
	transition: transform 160ms ease, box-shadow 190ms ease, background-color 180ms ease;
}

.btn:hover {
	transform: translateY(-1px);
}

.btn--primary {
	background: var(--action-green);
	color: #ffffff;
	box-shadow: 0 10px 24px rgba(45, 90, 39, 0.22);
}

.btn--outline {
	border: 1.5px solid var(--action-green);
	color: var(--action-green);
	background: transparent;
}

.hero__visual {
	position: relative;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	min-height: 420px;
}

.hero__shape {
	position: absolute;
	width: min(38vw, 460px);
	aspect-ratio: 4 / 5;
	border-radius: 44% 56% 45% 55% / 52% 40% 60% 48%;
	background: linear-gradient(145deg, #e8dccf, #f5efe6 65%, #dfd0c2);
	right: clamp(0.2rem, 0.6vw, 0.8rem);
	filter: drop-shadow(0 24px 38px rgba(23, 18, 12, 0.18));
}

.hero__image {
	position: relative;
	width: min(36vw, 430px);
	aspect-ratio: 4 / 5;
	object-fit: cover;
	object-position: center 24%;
	border-radius: 30px;
	border: 8px solid #fbf9f4;
	box-shadow: 0 18px 42px rgba(28, 22, 16, 0.24);
	transform: translateX(-4%);
}

@media (max-width: 960px) {
	.hero {
		grid-template-columns: 1fr;
		gap: 1.65rem;
		min-height: auto;
		padding: 1.6rem 1.15rem 2rem;
	}

	.hero__content {
		order: 2;
	}

	.hero__visual {
		order: 1;
		justify-content: center;
		min-height: 270px;
	}

	.hero__shape,
	.hero__image {
		width: min(78vw, 360px);
	}

	.hero__image {
		transform: translateX(0);
	}
}
</style>

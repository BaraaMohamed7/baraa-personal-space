import type { Language } from '@/data/site';

// Non-destructive, vector silhouette over the unedited source photo.
// Avoids re-generated face/clothing/text details and hard-edged cutout PNG artifacts.
const silhouette = "M 696 160\nC 765 150 812 212 811 306\nC 810 330 832 344 828 371\nC 823 397 811 415 806 451\nC 801 479 777 499 762 502\nC 776 518 809 525 831 506\nC 904 490 970 509 1024 557\nC 1072 605 1094 692 1089 745\nC 1138 840 1155 1098 1165 1275\nL 90 1275\nC 205 1205 227 1147 249 1078\nC 270 1005 292 937 314 862\nC 343 766 354 679 392 604\nC 422 554 453 544 529 524\nC 575 514 608 509 612 500\nC 572 469 557 428 550 390\nC 547 372 565 340 586 311\nC 575 263 586 227 618 194\nC 646 166 670 158 696 160\nZ";

export default function HeroPortrait({ lang }: { lang: Language }) {
  return (
    <svg
      className="hero-portrait"
      viewBox="155 145 1050 1135"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={lang === 'ar' ? 'صورة شخصية للبراء وهو جالس ومبتسم' : 'Baraa smiling in an informal seated portrait'}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id="portrait-shape" clipPathUnits="userSpaceOnUse">
          <path d={silhouette} />
        </clipPath>
        <linearGradient id="portrait-fade-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" />
          <stop offset="83%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </linearGradient>
        <mask id="portrait-bottom-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="1278" height="1280">
          <rect width="1278" height="1280" fill="url(#portrait-fade-gradient)" />
        </mask>
      </defs>
      <image
        href="/images/hero-original.png"
        x="0" y="0" width="1278" height="1280"
        preserveAspectRatio="none"
        clipPath="url(#portrait-shape)"
        mask="url(#portrait-bottom-fade)"
      />
    </svg>
  );
}

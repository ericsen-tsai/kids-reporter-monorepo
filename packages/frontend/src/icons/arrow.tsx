export const ArrowLeft = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_3400_15242)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.8839 3.11612C16.3957 2.62796 15.6043 2.62796 15.1161 3.11612L7.11612 11.1161C6.8817 11.3505 6.75 11.6685 6.75 12C6.75 12.3315 6.8817 12.6495 7.11612 12.8839L15.1161 20.8839C15.6043 21.372 16.3957 21.372 16.8839 20.8839C17.372 20.3957 17.372 19.6043 16.8839 19.1161L9.76777 12L16.8839 4.88388C17.372 4.39573 17.372 3.60427 16.8839 3.11612Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_3400_15242">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export const ArrowRight = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_3400_15283)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.11612 3.11612C7.60427 2.62796 8.39573 2.62796 8.88388 3.11612L16.8839 11.1161C17.1183 11.3505 17.25 11.6685 17.25 12C17.25 12.3315 17.1183 12.6495 16.8839 12.8839L8.88388 20.8839C8.39573 21.372 7.60427 21.372 7.11612 20.8839C6.62796 20.3957 6.62796 19.6043 7.11612 19.1161L14.2322 12L7.11612 4.88388C6.62796 4.39573 6.62796 3.60427 7.11612 3.11612Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_3400_15283">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export const ArrowDown = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_535_16631)">
        <path
          d="M5 9L12 16L19 9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_535_16631">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export const ArrowUp = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_535_16632)">
        <path
          d="M19 15L12 8L5 15"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_535_16632">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

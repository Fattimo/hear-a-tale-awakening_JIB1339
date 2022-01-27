import React from "react"
import Link from "next/link"
import styles from "./Review.module.css"

const Review = (props) => {
    return (<div><div className={styles.titleHeader}>
        <Link href={`/reader/${props.bookId}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
            className={styles.readerIcon}
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
        <h1>Review Quizzes</h1>
        <div> </div>
      </div></div>)
}

export default Review
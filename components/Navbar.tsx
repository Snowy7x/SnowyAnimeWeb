import React, {Component} from "react";
import styles from "../styles/components/Navbar.module.css"
import {BsMenuApp, BsSearch} from "react-icons/bs";
import {AiOutlineFileSearch} from "react-icons/ai";
import {BiSearch} from "react-icons/bi";
import {useRouter} from "next/router";
import Link from "next/link";
import {Style} from "domelementtype";
import {HiMenu} from "react-icons/hi";
import {IoClose} from "react-icons/io5";

function Navbar({path, page = ""} : {path: string, page?: string}) : JSX.Element{
    const router = useRouter();
    const [search, setSearch] = React.useState("");
    const [showNav, setShowNav] = React.useState(false);
  return (
      <div>
          <nav className={styles.navbar}>
              <div className={styles.logo}>
                  <img src={path} />
              </div>

              <div className={styles.links}>
                  <Link href={`/`}>
                      <a  className={styles.nav_item + " " + (page == "home" && styles.active)}>Home</a>
                  </Link>
                  {/*<a href="#" className={styles.nav_item}>Animes</a>*/}
                  <Link href={`/seasonal`}>
                      <a  className={styles.nav_item + " " + (page == "seasonal" && styles.active)}>Seasonal Animes</a>
                  </Link>
                  {/*<a href="#" className={styles.nav_item}>Movies</a>*/}
              </div>

              <div className={styles.search}>
                  {/* search bar */}
                  <div className={styles.search_box}>
                      <input
                          type="text"
                          placeholder="Search anything"
                          className={styles.search_input}
                          onChange={(e) => {
                              setSearch(e.target.value);
                          }}
                          value={search}
                          onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                  router.push(`/search/${search}`);
                              }
                          }
                          }
                      />
                      <a className={styles.search_btn} >
                          <BiSearch className={styles.search_icon} />
                      </a>
                  </div>
              </div>
          </nav>
          <div className={styles.mobile_nav}>
              <div className={styles.mobile_nav_icon} onClick={() => {
                    setShowNav(!showNav);
              }}>
                  {showNav ? <IoClose className={styles.mobile_nav_icon_close} /> : <HiMenu className={styles.mobile_nav_icon_open} />}
              </div>
              <div className={styles.mobile_menu + " " + (showNav ? styles.active_menu : "")}>
                  <div className={styles.logo}>
                      <img src={path} />
                  </div>
                  <div className={styles.search}>
                      {/* search bar */}
                      <div className={styles.search_box}>
                          <input
                              type="text"
                              placeholder="Search anything"
                              className={styles.search_input}
                              onChange={(e) => {
                                  setSearch(e.target.value);
                              }}
                              value={search}
                              onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                      router.push(`/search/${search}`);
                                  }
                              }
                              }
                          />
                          <a onClick={() => {
                             router.push(`/search/${search}`);
                          }} className={styles.search_btn}
                            href={""}>
                              <BiSearch onClick={() => {
                                  router.push(`/search/${search}`);
                              }
                              }  className={styles.search_icon} />
                          </a>
                      </div>
                  </div>
                  <div className={styles.mobile_nav_links}>
                      <Link href={`/`}>
                          <a  className={styles.mobile_nav_item + " " + (page == "home" && styles.active)}>Home</a>
                      </Link>
                      {/*<a href="#" className={styles.mobile_nav_item}>Animes</a>*/}
                      <Link href={`/seasonal`}>
                          <a  className={styles.mobile_nav_item + " " + (page == "seasonal" && styles.active)}>Seasonal Animes</a>
                      </Link>
                      {/*<a href="#" className={styles.mobile_nav_item}>Movies</a>*/}
                  </div>
              </div>
          </div>
      </div>
  );
}

export default Navbar;

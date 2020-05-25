import React, { Component } from "react";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCubes, faBrain, faBolt } from '@fortawesome/free-solid-svg-icons'

class Landing extends Component {
  render() {
    return (
      <div>
        <div className="bg-indigo-900 px-4 py-4">
          <div className="md:max-w-6xl md:mx-auto md:flex md:items-center md:justify-between">
            <div className="flex justify-between items-center">
              <a href="#" className="inline-block py-2 text-white text-xl font-bold">ZIwG Chatbot</a>
              <div className="inline-block cursor-pointer md:hidden">
                <div className="bg-gray-400 w-8 mb-2" style={{ height: '2px' }} />
                <div className="bg-gray-400 w-8 mb-2" style={{ height: '2px' }} />
                <div className="bg-gray-400 w-8" style={{ height: '2px' }} />
              </div>
            </div>
            <div>
              <div className="hidden md:block">
              </div>
            </div>
            <div className="hidden md:block">
              <Link to="/login" className="inline-block py-1 md:py-4 text-gray-500 hover:text-gray-100 mr-6">Login</Link>
              <Link to="/register" className="inline-block py-2 px-4 text-gray-700 bg-white hover:bg-gray-100 rounded-lg">Sign Up</Link>
            </div>
          </div>
        </div>
        <div className="bg-indigo-900 md:overflow-hidden">
          <div className="px-4 py-20 md:py-4">
            <div className="md:max-w-6xl md:mx-auto">
              <div className="md:flex md:flex-wrap">
                <div className="md:w-1/2 text-center md:text-left md:pt-16">
                  <h1 className="font-bold text-white text-2xl md:text-5xl leading-tight mb-4">
                    Simple chatbot to suit all your needs
            </h1>
                  <p className="text-indigo-200 md:text-xl md:pr-48">
                    ZIwG Chatbot is an AI-based interactive and innovative chatbot,
                    that allows you to connect external services like APIs and
                    databases to get the data using MLP.
            </p>
                  <Link to="/register" className="mt-6 mb-12 md:mb-0 md:mt-10 inline-block py-3 px-8 text-white bg-red-500 hover:bg-red-600 rounded-lg shadow">Get Started</Link>
                </div>
                <div className="md:w-1/2 relative">
                  <div className="hidden md:block">
                    <div className="-ml-24 -mb-40 absolute left-0 bottom-0 w-40 bg-white rounded-lg shadow-lg px-6 py-8" style={{ transform: 'rotate(-8deg)' }}>
                      <div className="mx-auto relative mb-8 py-2 w-20 text-center">
                        <FontAwesomeIcon icon={faBrain} color="#434190" size="5x" />
                      </div>
                      <div className="text-gray-800 text-center">
                        AI <br />Powered
                </div>
                    </div>
                    <div className="ml-24 mb-16 absolute left-0 bottom-0 w-40 bg-white rounded-lg shadow-lg px-6 py-8" style={{ transform: 'rotate(-8deg)', zIndex: 2 }}>
                      <div className="mx-auto relative mb-8 py-2 w-20 text-center">
                        <FontAwesomeIcon icon={faCubes} color="#434190" size="5x" />
                      </div>
                      <div className="text-gray-800 text-center">
                        Infinite Integrations
                </div>
                    </div>
                    <div className="ml-32 absolute left-0 bottom-0 w-48 bg-white rounded-lg shadow-lg px-10 py-8" style={{ transform: 'rotate(-8deg)', zIndex: 2, marginBottom: '-220px' }}>
                      <div className="mx-auto relative mb-8 py-2 w-20 text-center">
                        <FontAwesomeIcon icon={faBolt} color="#434190" size="5x" />
                      </div>
                      <div className="text-gray-800 text-center">
                        Quick as <br />Lightning
                </div>
                    </div>
                    <div className="mt-10 w-full absolute right-0 top-0 flex rounded-lg bg-white overflow-hidden shadow-lg" style={{ transform: 'rotate(-8deg)', marginRight: '-250px', zIndex: 1 }}>
                      <div className="w-32 bg-gray-200" style={{ height: '560px' }} />
                      <div className="flex-1 p-6">
                        <h2 className="text-lg text-gray-700 font-bold mb-3">
                          Ask Chatbot
                        </h2>
                        <div className="w-full flex flex-wrap justify-between items-center border-b-2 border-gray-100 py-3">
                          <div className="w-1/3">
                            <div className="flex">
                              <div className="h-8 w-8 rounded bg-gray-200 mr-4" />
                              <div>
                                <div className="h-2 w-16 bg-gray-200 mb-1 rounded-full" />
                                <div className="h-2 w-10 bg-gray-100 rounded-full" />
                              </div>
                            </div>
                          </div>
                          <div className="w-1/3">
                            <div className="h-2 w-10 bg-gray-100 rounded-full mx-auto" />
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-between items-center border-b-2 border-gray-100 py-3">
                          <div className="w-1/3">
                            <div className="flex">
                              <div className="h-8 w-8 rounded bg-gray-200 mr-4" />
                              <div>
                                <div className="h-2 w-16 bg-gray-200 mb-1 rounded-full" />
                                <div className="h-2 w-10 bg-gray-100 rounded-full" />
                              </div>
                            </div>
                          </div>
                          <div className="w-1/3">
                            <div className="h-2 w-16 bg-gray-100 rounded-full mx-auto" />
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-between items-center border-b-2 border-gray-100 py-3">
                          <div className="w-1/3">
                            <div className="flex">
                              <div className="h-8 w-8 rounded bg-gray-200 mr-4" />
                              <div>
                                <div className="h-2 w-16 bg-gray-200 mb-1 rounded-full" />
                                <div className="h-2 w-10 bg-gray-100 rounded-full" />
                              </div>
                            </div>
                          </div>
                          <div className="w-1/3">
                            <div className="h-2 w-8 bg-gray-100 rounded-full mx-auto" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full absolute left-0 bottom-0 ml-1" style={{ transform: 'rotate(-8deg)', zIndex: 1, marginBottom: '-360px' }}>
                      <div className="grid--gray h-48 w-48" />
                    </div>
                  </div>
                  <div className="md:hidden w-full absolute right-0 top-0 flex rounded-lg bg-white overflow-hidden shadow">
                    <div className="h-4 bg-gray-200 absolute top-0 left-0 right-0 rounded-t-lg flex items-center">
                      <span className="h-2 w-2 rounded-full bg-red-500 inline-block mr-1 ml-2" />
                      <span className="h-2 w-2 rounded-full bg-orange-400 inline-block mr-1" />
                      <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-1" />
                    </div>
                    <div className="flex-1 px-4 py-8">
                      <h2 className="text-xs text-gray-700 font-bold mb-1">
                        Ask Chatbot
                </h2>
                      <div className="w-full flex flex-wrap justify-between items-center border-b-2 border-gray-100 py-3">
                        <div className="w-1/3">
                          <div className="flex">
                            <div className="h-5 w-5 rounded-full bg-gray-200 mr-3 flex-shrink-0" />
                            <div>
                              <div className="h-2 w-16 bg-gray-200 mb-1 rounded-full" />
                              <div className="h-2 w-10 bg-gray-100 rounded-full" />
                            </div>
                          </div>
                        </div>
                        <div className="w-1/3">
                          <div className="h-2 w-10 bg-gray-100 rounded-full mx-auto" />
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-between items-center py-3">
                        <div className="w-1/3">
                          <div className="flex">
                            <div className="h-5 w-5 rounded-full bg-gray-200 mr-3 flex-shrink-0" />
                            <div>
                              <div className="h-2 w-16 bg-gray-200 mb-1 rounded-full" />
                              <div className="h-2 w-10 bg-gray-100 rounded-full" />
                            </div>
                          </div>
                        </div>
                        <div className="w-1/3">
                          <div className="h-2 w-16 bg-gray-100 rounded-full mx-auto" />
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-between items-center py-3">
                        <div className="w-1/3">
                          <div className="flex">
                            <div className="h-5 w-5 rounded-full bg-gray-200 mr-3 flex-shrink-0" />
                            <div>
                              <div className="h-2 w-16 bg-gray-200 mb-1 rounded-full" />
                              <div className="h-2 w-10 bg-gray-100 rounded-full" />
                            </div>
                          </div>
                        </div>
                        <div className="w-1/3">
                          <div className="h-2 w-16 bg-gray-100 rounded-full mx-auto" />
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-between items-center py-3">
                        <div className="w-1/3">
                          <div className="flex">
                            <div className="h-5 w-5 rounded-full bg-gray-200 mr-3 flex-shrink-0" />
                            <div>
                              <div className="h-2 w-16 bg-gray-200 mb-1 rounded-full" />
                              <div className="h-2 w-10 bg-gray-100 rounded-full" />
                            </div>
                          </div>
                        </div>
                        <div className="w-1/3">
                          <div className="h-2 w-16 bg-gray-100 rounded-full mx-auto" />
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-between items-center py-3">
                        <div className="w-1/3">
                          <div className="flex">
                            <div className="h-5 w-5 rounded-full bg-gray-200 mr-3 flex-shrink-0" />
                            <div>
                              <div className="h-2 w-16 bg-gray-200 mb-1 rounded-full" />
                              <div className="h-2 w-10 bg-gray-100 rounded-full" />
                            </div>
                          </div>
                        </div>
                        <div className="w-1/3">
                          <div className="h-2 w-16 bg-gray-100 rounded-full mx-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mr-3 md:hidden absolute right-0 bottom-0 w-40 bg-white rounded-lg shadow-lg px-10 py-6" style={{ zIndex: 2, marginBottom: '-380px' }}>
                    <div className="mx-auto w-20 pt-3 mb-12 relative text-center">
                      <FontAwesomeIcon icon={faBolt} color="#434190" size="5x" />
                    </div>
                    <div className="text-gray-800 text-center text-sm">
                      Quick as <br />Lightning
              </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <svg className="fill-current text-white hidden md:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fillOpacity={1} d="M0,224L1440,32L1440,320L0,320Z" />
          </svg>
        </div>
        <p className="text-center p-4 text-gray-600 pt-10">
          ZIwG 2020
        </p>
      </div>

    );
  }
}

export default Landing;

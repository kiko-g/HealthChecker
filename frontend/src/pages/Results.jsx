import axios from 'axios'
import Layout from '../layout/Layout'
import Search from '../components/Search'
import Highlight from '../components/Highlight'
import QueryBanner from '../components/QueryBanner'
import ResultsLoading from '../components/ResultsLoading'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Disclosure, Transition, Switch } from '@headlessui/react'
import {
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SpeakerphoneIcon,
} from '@heroicons/react/outline'

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
})

export default function Results() {
  const { query } = useParams()
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState([])
  const [limit, setLimit] = useState(12)
  const [others, setOthers] = useState(true)
  const [ordered, setOrdered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [overviewActive, setOverviewActive] = useState(false)
  const [overviewMounted, setOverviewMounted] = useState(false)
  const [overviewActiveItem, setOverviewActiveItem] = useState(null)
  const [results, setResults] = useState({ all: [], ordered: [], detailed: [], undetailed: [] })
  const [overviewDisplayItem, setOverviewDisplayItem] = useState({
    abstract: '',
    causes: '',
    symptoms: '',
    treatment: '',
    complications: '',
  })

  const Result = ({ index, label = '', definition = '', detailed = true, exact = false }) => (
    <div
      className="relative p-3 shadow rounded-md bg-white dark:bg-slate-500 space-y-1"
      key={`result-detailed-${index}`}
    >
      <Disclosure defaultOpen={index < 3}>
        {({ open }) => (
          <>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setOverviewActive(true)
                  if (others) setOverviewActiveItem(results.ordered[index])
                  else setOverviewActiveItem(results.detailed[index])
                }}
                className="capitalize font-medium text-sm tracking-wide duration-150
              text-slate-700 dark:text-white hover:text-blue-200 dark:hover:text-blue-100"
              >
                {label}
              </button>
              <div className="self-center flex items-center justify-center space-x-2">
                {exact ? (
                  <>
                    <div
                      className={`px-1.5 py-0.5 text-xs lowercase rounded-xl border-2 bg-purple-100 border-violet-300/60 text-slate-700`}
                    >
                      Exact match
                    </div>
                    <span className={`rounded-full ${exact ? 'bg-purple-400' : ''} h-5 w-5`}></span>
                  </>
                ) : null}
                {detailed ? (
                  <Disclosure.Button
                    className={`h-5 w-5 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-100 hover:opacity-80 duration-150`}
                  >
                    <ChevronUpIcon className={`w-4 h-4 text-slate-800 ${open ? 'transform rotate-180' : ''}`} />
                  </Disclosure.Button>
                ) : null}
                <span className={`rounded-full ${detailed ? 'bg-teal-400' : 'bg-orange-300'} h-5 w-5`}></span>
              </div>
            </div>
            {detailed ? (
              <Transition
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="text-sm font-light text-gray-600 dark:text-white">
                  {definition}
                </Disclosure.Panel>
              </Transition>
            ) : null}
          </>
        )}
      </Disclosure>
    </div>
  )

  useEffect(() => {
    let requests = [
      axiosInstance.get(`/infectious/bioportal/search/${query}`),
      axiosInstance.get(`/infectious/dbpedia/getAbstract/${query}`),
    ]
    axios
      .all(requests)
      .then(
        axios.spread((...responses) => {
          let raw = responses[0].data.results.bindings
          let exact = raw.find((entry) => entry.label.value.toLowerCase() === query.toLowerCase())
          raw.splice(raw.indexOf(exact), 1)

          let results = [exact].concat(raw)
          let details = results.filter((item) => item.definition.value !== undefined)
          let nodetails = results.filter((item) => item.definition.value === undefined)

          setResults({
            default: results,
            ordered: ordered ? [...details, ...nodetails] : results,
            detailed: details,
            undetailed: nodetails,
          })

          let pageArray = []
          if (others) {
            for (let i = 0; i < results.length / limit; i++) pageArray.push(i + 1)
          } else for (let i = 0; i < details.length / limit; i++) pageArray.push(i + 1)
          setPages(pageArray)
        })
      )
      .catch((errors) => console.error(errors))
      .then(() => setMounted(true))
  }, [query, limit, others, ordered])

  useEffect(() => {
    if (overviewActiveItem === null) return null
    const label = overviewActiveItem.label.value
    // const uri = overviewActiveItem.uri.value
    // const doid = uri.split('DOID_')[1]

    let requests = [axiosInstance.get(`/infectious/dbpedia/getAbstract/${label}`)]
    axios
      .all(requests)
      .then(
        axios.spread((...responses) => {
          let results = responses[0].data.results.bindings
          let abstract = 'No abstract found'
          let causes = 'No causes found'
          let symptoms = 'No symptoms found'
          let treatment = 'No treatment found'
          let complications = 'No complications found'

          if (results.length !== 0) {
            if (results[0].abstract) abstract = results[0].abstract.value
            if (results[0].causes) causes = results[0].causes.value
            if (results[0].symptoms) symptoms = results[0].symptoms.value
            if (results[0].treatment) treatment = results[0].treatment.value
            if (results[0].complications) complications = results[0].complications.value
          }

          setOverviewDisplayItem({
            abstract: abstract,
            causes: causes,
            symptoms: symptoms,
            treatment: treatment,
            complications: complications,
          })
        })
      )
      .catch((errors) => console.error(errors))
      .then(() => setOverviewMounted(true))
  }, [overviewActiveItem])

  const calculatePageLimits = () => {
    if (page < 3 || pages.length < 5) return { start: 0, end: 5 }
    else return { start: page - 2, end: page + 3 }
  }

  return (
    <Layout>
      {mounted ? (
        overviewActive ? (
          overviewMounted ? (
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setOverviewActive(false)
                    setOverviewMounted(false)
                  }}
                  className="flex items-center justify-center p-2 px-2 rounded duration-150 border-2
                bg-rose-100/50 border-rose-700/25 text-rose-700 hover:bg-rose-400 hover:text-white
                dark:bg-rose-50 dark:border-rose-300/75 dark:text-rose-700 dark:hover:border-rose-400 dark:hover:bg-rose-400 dark:hover:text-white"
                >
                  <ArrowLeftIcon className="w-6 h-6 pr-2 py-1" />
                  <span className="self-center text-sm font-medium px-1">Go back</span>
                </button>
                <h2 className="flex-1 flex items-center justify-end space-x-2 p-2 bg-blue-100 border-2 border-blue-300/50 text-slate-700 rounded capitalize">
                  <SpeakerphoneIcon className="h-6 w-6 p-0.5" aria-hidden="true" />
                  <span>{overviewActiveItem.label.value}</span>
                </h2>
              </div>

              <Highlight header="Abstract" text={overviewDisplayItem.abstract || 'No abstract found'} />
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-3 w-full">
                {Object.keys(overviewDisplayItem)
                  .filter((spec) => spec !== 'abstract')
                  .map((spec, specIdx) => (
                    <Highlight
                      header={spec}
                      key={`${overviewActiveItem.label.value}-${spec}-${specIdx}`}
                      text={overviewDisplayItem[spec] || `No ${spec} found`}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <ResultsLoading />
          )
        ) : (
          <div className="min-h-[calc(100vh-10rem)] flex flex-col justify-between mb-5">
            <div className="space-y-3 mb-5">
              {/* Top bar */}
              <div className="grid grid-cols-12 gap-2">
                <QueryBanner query={query} classnames="col-span-12 xl:col-span-6 2xl:col-span-8" />
                {/* Purple Settings */}
                <div
                  className={`col-span-12 w-full xl:col-span-6 2xl:col-span-4 flex items-center justify-between
                  bg-violet-100 border-2 border-violet-300/60 text-slate-700
                  rounded space-x-2 mx-auto p-2 sm:px-4 lg:px-6`}
                >
                  {/* Limit toggler */}
                  <div className="flex items-center justify-between flex-wrap -space-x-px">
                    <button
                      type="button"
                      disabled={limit <= 3}
                      onClick={() => setLimit(limit - 3)}
                      className="relative h-10 inline-flex items-center px-2 py-2 rounded-l-md
                          border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50
                          disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      <span className="sr-only">Previous</span>
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <span
                      type="button"
                      className="bg-white border-gray-300 text-gray-500
                        relative h-10 inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      {limit}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLimit(limit + 3)}
                      className="relative h-10 inline-flex items-center px-2 py-2 rounded-r-md
                          border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50
                          disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Results bioportal definition toggler */}
                  <div
                    className="flex items-center border border-gray-300 bg-white 
                    h-10 p-2 space-x-1 rounded"
                  >
                    <Switch.Group>
                      <Switch.Label className="self-center w-min text-xs" passive>
                        Definition
                      </Switch.Label>
                      <Switch
                        checked={others}
                        onChange={setOthers}
                        className={`${
                          others ? 'bg-orange-300' : 'bg-teal-400'
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      >
                        <span className="sr-only">Enable notifications</span>
                        <span
                          className={`transform transition ease-in-out duration-200 ${
                            others ? 'translate-x-6' : 'translate-x-1'
                          } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                      </Switch>
                    </Switch.Group>
                  </div>

                  {/* Results default order toggler */}
                  <div
                    className="flex items-center border border-gray-300 bg-white 
                    h-10 p-2 space-x-1 rounded"
                  >
                    <Switch.Group>
                      <Switch.Label className="self-center w-min text-xs" passive>
                        Order
                      </Switch.Label>
                      <Switch
                        checked={ordered}
                        onChange={setOrdered}
                        className={`${
                          ordered ? 'bg-rose-400' : 'bg-blue-400'
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      >
                        <span className="sr-only">Enable notifications</span>
                        <span
                          className={`transform transition ease-in-out duration-200 ${
                            ordered ? 'translate-x-6' : 'translate-x-1'
                          } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                      </Switch>
                    </Switch.Group>
                  </div>
                </div>
              </div>

              {/* Search bar */}
              <div className="flex justify-between">
                <Search
                  width="full"
                  alternate={true}
                  setMounted={setMounted}
                  classnames="border-2 border-gray-100 rounded"
                />
              </div>

              <div>
                <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 w-full`}>
                  {others
                    ? results.ordered
                        .slice((page - 1) * limit, page * limit)
                        .map((item, index) => (
                          <Result
                            key={`results-all-${index}`}
                            index={index}
                            label={item.label.value}
                            definition={item.definition.value}
                            detailed={item.definition.value !== undefined}
                            exact={item.label.value.toLowerCase() === query.toLowerCase()}
                          />
                        ))
                    : results.detailed
                        .slice((page - 1) * limit, page * limit)
                        .map((item, index) => (
                          <Result
                            key={`results-premium-${index}`}
                            index={index}
                            label={item.label.value}
                            definition={item.definition.value}
                            detailed={item.definition.value !== undefined}
                            exact={item.label.value.toLowerCase() === query.toLowerCase()}
                          />
                        ))}
                </div>
              </div>
            </div>

            <nav
              aria-label="Pagination"
              className="flex items-center justify-center relative z-0 rounded-md -space-x-px"
            >
              <button
                type="button"
                key={`page-button-previous`}
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md
                border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50
                disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              {pages.slice(calculatePageLimits().start, calculatePageLimits().end).map((item, index) => (
                <button
                  key={`page-button-${item}`}
                  type="button"
                  onClick={() => setPage(item)}
                  className={`${
                    item === page
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                >
                  {item}
                </button>
              ))}
              <button
                type="button"
                key={`page-button-next`}
                onClick={() => setPage(page + 1)}
                disabled={page > pages.length - 1}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md
                border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50
                disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        )
      ) : (
        <ResultsLoading />
      )}
    </Layout>
  )
}
